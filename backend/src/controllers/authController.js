import User from '../models/userModel.js';

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
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
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
    const currentUser = await User.findById(decoded.id);
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
