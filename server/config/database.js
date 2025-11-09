const { Sequelize } = require('sequelize');

// Database connection configuration for PostgreSQL (Neon)
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/taxmanagement', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Optimized for serverless (Vercel + Neon)
  pool: {
    max: 2,          // Maximum number of connections (low for serverless)
    min: 0,          // Minimum connections
    acquire: 3000,   // Maximum time to get connection
    idle: 0,         // Connections are released immediately when not in use
    evict: 1000,     // How often to check for idle connections
  },
  
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false,
    connectTimeout: 5000,  // 5 seconds timeout for connection
  },
  
  // Retry logic
  retry: {
    max: 3,
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ENOTFOUND/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ]
  }
});

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL database:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
