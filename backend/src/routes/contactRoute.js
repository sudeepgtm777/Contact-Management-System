import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteMultipleContacts,
} from '../controllers/contactController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/bulk', deleteMultipleContacts);
router.delete('/:id', deleteContact);

export default router;
