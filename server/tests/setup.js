const mongoose = require('mongoose');

// Setup test database (only if needed)
beforeAll(async () => {
  // Skip database connection for simple tests
  if (process.env.SKIP_DB_TESTS === 'true') {
    console.log('⏭️ Skipping database connection for simple tests');
    return;
  }

  // Check if already connected
  if (mongoose.connection.readyState === 0) {
    // Use test database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finstack-test';
    
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to test database');
    } catch (error) {
      console.error('❌ Test database connection failed:', error);
      console.log('💡 To run database tests, start MongoDB or set SKIP_DB_TESTS=true');
      // Don't exit, just skip database tests
      process.env.SKIP_DB_TESTS = 'true';
    }
  } else {
    console.log('✅ Already connected to database');
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log('✅ Test database connection closed');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
