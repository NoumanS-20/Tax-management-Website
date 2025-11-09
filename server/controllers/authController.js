const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Development-safe defaults for JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me-32chars-minimum-xxxxxxxx';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me-32chars-minimum-yyyyyyyy';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Register new user
const register = async (req, res) => {
  const timings = { start: Date.now() };
  try {
    console.log('[TIMING] Registration start');
    const { email, password, firstName, lastName, panNumber, phone } = req.body;

    // Check if user already exists
    timings.beforeEmailCheck = Date.now();
    const existingUser = await User.findOne({ where: { email } });
    timings.afterEmailCheck = Date.now();
    console.log(`[TIMING] Email check took ${timings.afterEmailCheck - timings.beforeEmailCheck}ms`);
    
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if PAN number already exists (if provided)
    if (panNumber) {
      timings.beforePANCheck = Date.now();
      const existingPAN = await User.findOne({ where: { panNumber } });
      timings.afterPANCheck = Date.now();
      console.log(`[TIMING] PAN check took ${timings.afterPANCheck - timings.beforePANCheck}ms`);
      
      if (existingPAN) {
        return res.status(400).json({
          success: false,
          message: 'User with this PAN number already exists'
        });
      }
    }

    // Create new user (password hashing happens in beforeCreate hook)
    timings.beforeUserCreate = Date.now();
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      panNumber,
      phone
    });
    timings.afterUserCreate = Date.now();
    console.log(`[TIMING] User.create() (including bcrypt) took ${timings.afterUserCreate - timings.beforeUserCreate}ms`);

    // Generate tokens
    timings.beforeTokens = Date.now();
    const { accessToken, refreshToken } = generateTokens(user.id);
    timings.afterTokens = Date.now();
    console.log(`[TIMING] Token generation took ${timings.afterTokens - timings.beforeTokens}ms`);

    // Save refresh token
    timings.beforeRefreshSave = Date.now();
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id
    });
    timings.afterRefreshSave = Date.now();
    console.log(`[TIMING] Refresh token save took ${timings.afterRefreshSave - timings.beforeRefreshSave}ms`);

    timings.end = Date.now();
    console.log(`[TIMING] Total registration time: ${timings.end - timings.start}ms`);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    timings.error = Date.now();
    console.error(`[TIMING] Error occurred at ${timings.error - timings.start}ms`);
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email (Sequelize doesn't hide password by default, we need to fetch it)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password (password is included in the fetched user)
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id
    });
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Refresh token
const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Check if token exists in database
    const tokenRecord = await RefreshToken.findOne({ 
      where: { 
        token: refreshToken,
        userId: decoded.userId 
      } 
    });

    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      await tokenRecord.destroy();
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Delete old refresh token and create new one
    await tokenRecord.destroy();
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        ...tokens,
        user
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      // Remove specific refresh token
      await RefreshToken.destroy({
        where: {
          token: refreshToken,
          userId: user.id
        }
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken: refreshTokenHandler,
  logout,
  getProfile
};