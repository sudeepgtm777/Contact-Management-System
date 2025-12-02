import express from 'express';
import {
  register,
  login,
  logout,
  isLoggedIn,
  protect,
  updateMyPassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isLoggedIn', isLoggedIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.patch('/updateMyPassword', protect, updateMyPassword);

export default router;
