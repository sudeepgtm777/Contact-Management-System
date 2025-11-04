import mongoose from 'mongoose';
import validator from 'validator';

const contactSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, 'Contact must have a name'],
      validate: {
        validator: function (val) {
          // Must contain at least two words, each made of alphabetic letters only
          return /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/.test(val.trim());
        },
        message:
          'Please enter your full name (first and last), using alphabets only.',
      },
    },
    user_logo: {
      type: String,
      default: 'default.jpg',
    },
    user_email: {
      type: String,
      required: [true, 'Contact must have an email'],
      unique: true,
      lowercase: true,
      validate: [
        {
          validator: validator.isEmail,
          message: 'Use a valid Email!',
        },
      ],
    },
    user_phone: {
      type: String,
      required: [true, 'Contact must have a phone number'],
    },
    property_type: {
      type: String,
      enum: ['Residential', 'Commercial'],
      required: [true, 'Property type is required'],
    },
    // It can be used for storing details or count or name
    properties: {
      type: String,
    },
    company: {
      type: String,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
