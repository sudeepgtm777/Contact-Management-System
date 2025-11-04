import Contact from '../models/contactModel.js';

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: { contacts },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Contact not found' });
    }
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Contact not found' });
    }

    res.status(200).json({ status: 'success', data: { contact } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
