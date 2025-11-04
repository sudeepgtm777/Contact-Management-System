import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, 'Contact must have a name'],
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
