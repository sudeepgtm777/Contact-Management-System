import express from 'express';
import {
  isLoggedIn,
  login,
  logout,
  register,
  protect,
  updateMyPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isLoggedIn', isLoggedIn);
router.patch('/updateMyPassword', protect, updateMyPassword);

export default router;
