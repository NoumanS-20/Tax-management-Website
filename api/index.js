const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { URL } = require('url');
require('dotenv').config();

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

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);
app.use(requestLogger);

// CORS - updated for Vercel
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(generalLimiter);
app.use('/auth', authLimiter);
app.use('/documents/upload', uploadLimiter);

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
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SwiftTax API is running (with /api prefix)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SwiftTax API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
};

// Export as serverless function handler for Vercel
module.exports = async (req, res) => {
  try {
    // Normalize rewritten /api paths from Vercel so Express sees the original route
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

    // Log the incoming request for debugging
    console.log('Incoming request:', {
      method: req.method,
      url: req.url,
      path: req.path,
      originalUrl: req.originalUrl
    });
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: error.message
    });
  }
};
