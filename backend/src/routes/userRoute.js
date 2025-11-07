import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

export default router;
