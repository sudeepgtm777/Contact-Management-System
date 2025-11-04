import express from 'express';
import {
  createContact,
  getAllContacts,
  getContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:id', getContact);

export default router;
