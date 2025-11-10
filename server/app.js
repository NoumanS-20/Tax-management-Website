const express = require('express');
const path = require('path');
const { sequelize } = require('./config/database');
const cors = require('cors');
require('dotenv').config();

// Import models (must be imported before routes to establish associations)
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');

// Define associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Import routes
const authRoutes = require('./routes/auth');
const taxRoutes = require('./routes/tax');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');

// Import middleware
const {
  securityHeaders,
  sanitizeData,
  fileUploadSecurity,
  requestLogger,
  errorHandler
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for Render)
app.set('trust proxy', 1);

// CORS configuration
const corsConfig = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);
app.use(requestLogger);

// CORS
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload security
app.use('/api/documents/upload', fileUploadSecurity);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// ITR Guide download endpoint
app.get('/api/download-guide', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'ITR-Guide.pdf');
  res.download(filePath, 'Income-Tax-Guide-for-India.pdf', (err) => {
    if (err) {
      console.error('Error downloading guide:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to download ITR guide'
      });
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbTime = 0;
  
  try {
    if (sequelize.connectionManager.pool) {
      const queryStart = Date.now();
      await sequelize.authenticate();
      dbTime = Date.now() - queryStart;
      dbStatus = 'connected';
    }
  } catch (error) {
    dbStatus = 'error: ' + error.message;
  }
  
  const totalTime = Date.now() - startTime;
  
  res.json({ 
    success: true, 
    message: 'SwiftTax API is running on Render',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'PostgreSQL (Neon)',
      status: dbStatus,
      queryTime: `${dbTime}ms`
    },
    timing: {
      total: `${totalTime}ms`
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('🔄 Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL (Neon) database');
    
    // Sync database (tables should already exist from init-db.cjs)
    // Skip sync in production to avoid issues
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database synced');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`� Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM received, closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT received, closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Don't start server in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;