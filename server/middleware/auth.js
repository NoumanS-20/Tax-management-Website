const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same fallback as authController
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me-32chars-minimum-xxxxxxxx';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth failed: No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', { userId: decoded.userId });
    
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.isActive) {
      console.log('Auth failed: User not found or inactive', { userId: decoded.userId, userFound: !!user, isActive: user?.isActive });
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found.' 
      });
    }

    console.log('Auth successful for user:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', {
      name: error.name,
      message: error.message,
      token: req.header('Authorization')?.substring(0, 20) + '...'
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please refresh your token.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format or signature.' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = { auth, authorize };