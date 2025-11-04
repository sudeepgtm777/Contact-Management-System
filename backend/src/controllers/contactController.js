import Contact from '../models/contactModel.js';

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
