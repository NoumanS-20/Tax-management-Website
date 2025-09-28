const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const auth = require('../middleware/auth');

// Tax form routes
router.post('/', auth, taxController.createTaxForm);
router.get('/', auth, taxController.getTaxForms);
router.get('/:id', auth, taxController.getTaxForm);
router.put('/:id', auth, taxController.updateTaxForm);
router.post('/:id/submit', auth, taxController.submitForReview);
router.get('/:id/summary', auth, taxController.getTaxSummary);

// Admin/Accountant routes
router.get('/admin/reviews', auth, taxController.getFormsForReview);
router.post('/admin/:id/review', auth, taxController.reviewTaxForm);

module.exports = router;
