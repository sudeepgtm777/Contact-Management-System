import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

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

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// =====================
//  REGISTER Controller
// =====================
export const register = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError('Email already exists!', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

// =====================
//  LOGIN Controller
// =====================
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Check if user exists & password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. If everything ok, send token
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

// =====================
//  Check if User Logged In
// =====================
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
