import { promisify } from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from '../email/email.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// =====================================
// REGISTER & Send Verification Email
// =====================================
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already exists!', 400));

  const newUser = await User.create({ name, email, password, passwordConfirm });

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  newUser.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  newUser.emailVerificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await newUser.save({ validateBeforeSave: false });

  // Send email
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    status: 'success',
    message: 'User created. Please check your email to verify account.',
  });
});

// =====================
// VERIFY EMAIL
// =====================
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  if (!token) return next(new AppError('Token is required', 400));

  // Hash the token to match DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by hashed token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token invalid or expired', 400));

  // Update user
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: 'success', message: 'Email verified!' });
});

// ===========
// LOGIN
// ===========
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isVerified)
    return next(
      new AppError('Please verify your email before logging in.', 401)
    );

  createSendToken(user, 200, req, res);
});

// =====================
// FORGOT PASSWORD
// =====================
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('No user with this email', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendResetPasswordEmail(email, resetToken);

  res.status(200).json({
    status: 'success',
    message: 'Password reset email sent.',
  });
});

// =====================
// RESET PASSWORD
// =====================
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) return next(new AppError('Token invalid or expired', 400));

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, req, res);
});

// =====================
//  LOGOUT Controller
// =====================
export const logout = (req, res) => {
  if (!req.cookies?.jwt) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'No user logged in' });
  }

  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logout successful' });
};

// =========================
//  Check if User Logged In
// =========================
export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token || token === 'loggedout') {
      return res.status(200).json({ loggedIn: false });
    }

    // Verify token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      // Token invalid or expired
      return res.status(200).json({ loggedIn: false });
    }

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).populate({
      path: 'contacts',
      select: '-__v',
    });
    if (!currentUser) {
      return res.status(200).json({ loggedIn: false });
    }

    // User is logged in
    res.status(200).json({ loggedIn: true, user: currentUser });
  } catch (err) {
    console.error('Error in isLoggedIn:', err);
    res.status(200).json({ loggedIn: false });
  }
};

// =====================
//  PROTECT Middleware
// =====================
export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout') {
    return next(new AppError('Please log in to perform this action!', 401));
  }

  // 1. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 3. Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// =====================
//  UPDATE MY PASSWORD
// =====================
export const updateMyPassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  // 1. Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if current password matches
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // 3. Update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4. Log user in again (generate new JWT)
  createSendToken(user, 200, req, res);
});
