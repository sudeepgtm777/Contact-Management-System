import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users || users.length === 0) {
    return next(new AppError('No Users found!', 404));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
};

export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate({
    path: 'users',
    select: '-__v',
  });
  if (!user) {
    return next(new AppError('No Users found with Id!!', 404));
  }
  res.status(200).json({ status: 'success', data: { user } });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No Users found with Id!!', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});
