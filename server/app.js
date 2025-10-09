const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taxRoutes = require('./routes/tax');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');

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
} = require('./middleware/security');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);
app.use(requestLogger);

// CORS
app.use(cors(corsOptions));

// Rate limiting
app.use(generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/documents/upload', uploadLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload security
app.use('/api/documents/upload', fileUploadSecurity);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'FinStack India API is running',
    timestamp: new Date().toISOString()
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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finstack-india')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('💡 You can also use MongoDB Atlas cloud database');
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FinStack India API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;