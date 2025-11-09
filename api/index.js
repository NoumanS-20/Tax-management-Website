const express = require('express');
const path = require('path');
const { sequelize } = require('../server/config/database');
const cors = require('cors');
const { URL } = require('url');
require('dotenv').config();

// Import models (must be imported before routes to establish associations)
const User = require('../server/models/User');
const RefreshToken = require('../server/models/RefreshToken');

// Define associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Import routes
const authRoutes = require('../server/routes/auth');
const taxRoutes = require('../server/routes/tax');
const documentRoutes = require('../server/routes/documents');
const notificationRoutes = require('../server/routes/notifications');
const contactRoutes = require('../server/routes/contact');

// Import middleware
const {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
  sanitizeData,
  fileUploadSecurity,
  requestLogger,
  errorHandler,
  corsOptions
} = require('../server/middleware/security');

const app = express();
app.set('trust proxy', 1);

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

// CORS - updated for Vercel
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Rate limiting - DISABLED for debugging timeout issue
// app.use(generalLimiter);
// app.use('/auth', authLimiter);
// app.use('/documents/upload', uploadLimiter);
console.log('[DEBUG] Rate limiting middleware DISABLED for debugging');

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('=== REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('====================');
  next();
});

// File upload security
app.use('/documents/upload', fileUploadSecurity);

// Serve static files (when needed)
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));
app.use('/public', express.static(path.join(__dirname, '../server/public')));

// API Routes - Mount at both /api and root to handle Vercel routing variations
app.use('/api/auth', authRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// Also mount without /api prefix in case Vercel strips it
app.use('/auth', authRoutes);
app.use('/tax', taxRoutes);
app.use('/documents', documentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/contact', contactRoutes);

// Debug endpoint - both paths
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Debug endpoint hit with /api prefix',
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url
  });
});

app.get('/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Debug endpoint hit without /api prefix',
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url
  });
});


// ITR Guide download endpoint - both paths
app.get('/api/download-guide', (req, res) => {
  const filePath = path.join(__dirname, '../server/public', 'ITR-Guide.pdf');
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

app.get('/download-guide', (req, res) => {
  const filePath = path.join(__dirname, '../server/public', 'ITR-Guide.pdf');
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

// Health check - both paths
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbTime = 0;
  
  try {
    if (sequelize.connectionManager.pool) {
      // Test actual DB query speed
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
    message: 'SwiftTax API is running (with /api prefix)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'PostgreSQL',
      status: dbStatus,
      queryTime: `${dbTime}ms`
    },
    timing: {
      total: `${totalTime}ms`
    }
  });
});

app.get('/health', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbTime = 0;
  
  try {
    if (sequelize.connectionManager.pool) {
      // Test actual DB query speed
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
    message: 'SwiftTax API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'PostgreSQL',
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

// Database connection - only connect once
let isConnected = false;

const connectDB = async () => {
  const startTime = Date.now();
  
  if (isConnected && sequelize.connectionManager.pool) {
    console.log('[TIMING] Database already connected (0ms)');
    return;
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('[TIMING] Starting PostgreSQL connection...');
    await sequelize.authenticate();
    
    // Skip sync in production to avoid timeout - tables should already exist
    // Run migrations or sync locally before deploying
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
    }
    
    const connectTime = Date.now() - startTime;
    isConnected = true;
    console.log(`✅ Connected to PostgreSQL database in ${connectTime}ms`);
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ MySQL connection error after ${errorTime}ms:`, error);
    isConnected = false;
    throw error;
  }
};

// Export as serverless function handler for Vercel
module.exports = async (req, res) => {
  const requestStartTime = Date.now();
  console.log(`[TIMING] ========== Request received at ${new Date().toISOString()} ==========`);
  
  try {
    // Normalize rewritten /api paths from Vercel so Express sees the original route
    const pathNormalizeStart = Date.now();
    try {
      const host = req.headers.host || 'localhost';
      const parsedUrl = new URL(req.url, `https://${host}`);
      if (parsedUrl.pathname === '/api/index.js' && parsedUrl.searchParams.has('path')) {
        const originalPath = parsedUrl.searchParams.get('path');
        const normalizedPath = originalPath.startsWith('/') ? originalPath : `/${originalPath}`;
        parsedUrl.searchParams.delete('path');
        const remainingQuery = parsedUrl.searchParams.toString();
        req.url = remainingQuery ? `${normalizedPath}?${remainingQuery}` : normalizedPath;
        req.originalUrl = req.url;
        req._parsedUrl = undefined;
      }
    } catch (rewriteError) {
      console.error('Failed to normalize request path:', rewriteError);
    }
    console.log(`[TIMING] Path normalization took ${Date.now() - pathNormalizeStart}ms`);

    // Ensure body is parsed for Vercel serverless
    const bodyParseStart = Date.now();
    if (req.body && typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        console.error('Failed to parse request body:', e);
      }
    }
    console.log(`[TIMING] Body parsing took ${Date.now() - bodyParseStart}ms`);

    // Log the incoming request for debugging
    console.log('Incoming request:', {
      method: req.method,
      url: req.url,
      path: req.path,
      originalUrl: req.originalUrl,
      bodyType: typeof req.body,
      hasBody: !!req.body
    });
    
    const dbConnectStart = Date.now();
    await connectDB();
    console.log(`[TIMING] connectDB() call took ${Date.now() - dbConnectStart}ms`);
    
    const expressHandlerStart = Date.now();
    console.log('[TIMING] Passing request to Express app...');
    
    // Wrap res.send/json to capture response timing
    const originalJson = res.json;
    const originalSend = res.send;
    
    res.json = function(...args) {
      const totalTime = Date.now() - requestStartTime;
      const expressTime = Date.now() - expressHandlerStart;
      console.log(`[TIMING] Response sent - Express handler: ${expressTime}ms, Total: ${totalTime}ms`);
      console.log(`[TIMING] ========== Request completed ==========`);
      return originalJson.apply(res, args);
    };
    
    res.send = function(...args) {
      const totalTime = Date.now() - requestStartTime;
      const expressTime = Date.now() - expressHandlerStart;
      console.log(`[TIMING] Response sent - Express handler: ${expressTime}ms, Total: ${totalTime}ms`);
      console.log(`[TIMING] ========== Request completed ==========`);
      return originalSend.apply(res, args);
    };
    
    return app(req, res);
  } catch (error) {
    const totalTime = Date.now() - requestStartTime;
    console.error(`[TIMING] Handler error after ${totalTime}ms:`, error);
    console.log(`[TIMING] ========== Request failed ==========`);
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: error.message
    });
  }
};
