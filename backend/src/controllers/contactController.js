import Contact from '../models/contactModel.js';
import User from '../models/userModel.js';
import APIFeatures from '../utils/apiFeatures.js';

import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createContact = catchAsync(async (req, res, next) => {
  const existingPhone = await Contact.findOne({
    user_phone: req.body.user_phone,
  });
  if (existingPhone) {
    return next(new AppError('Contact number already exists!', 400));
  }
  const contact = await Contact.create({ ...req.body, user: req.user._id });

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { contacts: contact._id } },
    { new: true, runValidators: true }
  );

  res.status(201).json({ status: 'success', data: { contact } });
});

export const getAllContacts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .limitFields()
    .paginate();

  const contacts = await features.query;

  if (!contacts || contacts.length === 0) {
    return next(new AppError('No Contacts found!', 404));
  }

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: { contacts },
  });
});

export const getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('No Contacts found with Id!!', 404));
  }
  res.status(200).json({ status: 'success', data: { contact } });
});

export const updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    return next(new AppError('No Contacts found with Id!!', 404));
  }

  res.status(200).json({ status: 'success', data: { contact } });
});

export const deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError('No Contacts found with Id!!', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});
