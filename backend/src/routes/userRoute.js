import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

export default router;
