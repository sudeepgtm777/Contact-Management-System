import express from 'express';
import {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:id', getContact);
router.put('/:id', updateContact);

export default router;
