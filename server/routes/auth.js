const express = require('express');
const { register, login, refreshToken, logout, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);

module.exports = router;