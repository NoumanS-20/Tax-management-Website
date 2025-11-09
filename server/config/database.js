const { Sequelize } = require('sequelize');

// Database connection configuration for MySQL
const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/taxmanagement', {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Optimized for serverless (Vercel)
  pool: {
    max: 2,          // Maximum number of connections (low for serverless)
    min: 0,          // Minimum connections
    acquire: 3000,   // Maximum time to get connection
    idle: 0,         // Connections are released immediately when not in use
    evict: 1000,     // How often to check for idle connections
  },
  
  dialectOptions: {
    connectTimeout: 5000,  // 5 seconds timeout for connection
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
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
    console.log('✅ MySQL database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
