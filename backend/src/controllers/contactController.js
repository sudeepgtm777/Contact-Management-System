import mongoose from 'mongoose';
import Contact from '../models/contactModel.js';
import User from '../models/userModel.js';
import APIFeatures from '../utils/apiFeatures.js';

import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createContact = catchAsync(async (req, res, next) => {
  const existingPhone = await Contact.findOne({
    user: req.user._id,
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
    .search()
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

export const getAllContactsOfLoggedInUser = catchAsync(
  async (req, res, next) => {
    const features = new APIFeatures(
      Contact.find({ user: req.user.id }),
      req.query
    )
      .filter()
      .search()
      .limitFields();
    const totalContacts = await features.query.clone().countDocuments();
    features.paginate();
    const contacts = await features.query;

    if (!contacts) {
      return next(new AppError('No contacts found for this user', 404));
    }

    res.status(200).json({
      status: 'success',
      totalContacts,
      results: contacts.length,
      data: { contacts },
    });
  }
);

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

  res.status(200).json({
    status: 'success',
    message: 'Contact deleted Succesfully!!!',
  });
});

export const deleteMultipleContacts = catchAsync(async (req, res, next) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(
      new AppError('Please provide an array of contact IDs to delete.', 400)
    );
  }

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    return next(
      new AppError(
        `Some of the provided IDs are invalid: ${invalidIds.join(', ')}`,
        400
      )
    );
  }

  const result = await Contact.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    return next(
      new AppError('No contacts found to delete with the provided IDs.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    message: `${result.deletedCount} contact(s) were deleted successfully.`,
  });
});
