import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Upload only images.', 400), false);
};

export const uploadUserPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  // Reject password updates here
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Use /updatePassword to change password!', 400));
  }

  // Allow only name update
  const filteredBody = filterObj(req.body, 'name');

  // If photo uploaded, add it
  if (req.file) filteredBody.photo = req.file.filename;

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: 'success', results: users.length, users });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ status: 'success', user });
});

export const updateUser = catchAsync(async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: 'success', updated });
});
