import express from 'express';
import { protect } from '../controllers/authController.js';
import { getAllUsers, getUser } from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUser);

export default router;
