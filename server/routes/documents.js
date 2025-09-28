const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

// Document routes
router.post('/upload', auth, documentController.upload.single('file'), documentController.uploadDocument);
router.get('/', auth, documentController.getDocuments);
router.get('/:id', auth, documentController.getDocument);
router.get('/:id/download', auth, documentController.downloadDocument);
router.put('/:id', auth, documentController.updateDocument);
router.delete('/:id', auth, documentController.deleteDocument);

// Admin/Accountant routes
router.get('/admin/verification', auth, documentController.getDocumentsForVerification);
router.post('/admin/:id/verify', auth, documentController.verifyDocument);

module.exports = router;
