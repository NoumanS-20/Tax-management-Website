const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Notification routes
router.get('/', auth, notificationController.getNotifications);
router.post('/:id/read', auth, notificationController.markAsRead);
router.post('/read-all', auth, notificationController.markAllAsRead);
router.delete('/:id', auth, notificationController.deleteNotification);

// Admin routes
router.post('/create', auth, notificationController.createNotification);
router.post('/bulk', auth, notificationController.sendBulkNotifications);
router.get('/stats', auth, notificationController.getNotificationStats);
router.post('/schedule', auth, notificationController.scheduleNotification);

module.exports = router;
