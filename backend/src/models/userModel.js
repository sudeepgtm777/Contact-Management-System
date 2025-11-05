import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!!!'],
    validate: {
      validator: function (val) {
        // Must contain at least two words, each made of alphabetic letters only
        return /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/.test(val.trim());
      },
      message:
        'Please enter your full name (first and last), using alphabets only.',
    },
  },

  email: {
    type: String,
    required: [true, 'A user must have an Email!'],
    unique: true,
    lowercase: true,
    validate: [
      {
        validator: validator.isEmail,
        message: 'Use a valid Email!',
      },
    ],
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  password: {
    type: String,
    required: [true, 'Provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm the password'],
    validate: {
      // This only works on Create and Save!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
