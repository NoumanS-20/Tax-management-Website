const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { auth, authorize } = require('../middleware/auth');

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes - require authentication and admin role
router.get('/', auth, authorize('admin'), getAllContacts);
router.get('/stats', auth, authorize('admin'), getContactStats);
router.get('/:id', auth, authorize('admin'), getContact);
router.put('/:id', auth, authorize('admin'), updateContactStatus);
router.delete('/:id', auth, authorize('admin'), deleteContact);

module.exports = router;
