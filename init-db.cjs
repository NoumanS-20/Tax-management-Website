// Script to initialize database tables
// Run this once to create the necessary tables in Neon PostgreSQL

require('dotenv').config();
const { sequelize } = require('./server/config/database');
const User = require('./server/models/User');
const RefreshToken = require('./server/models/RefreshToken');

// Define associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully');

    console.log('\nCreating tables...');
    
    // Force sync will drop existing tables and recreate them
    // Use { force: false } to only create if not exists
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ All tables created successfully!');
    
    // Show database info
    const dbName = sequelize.config.database;
    console.log(`\nDatabase: ${dbName}`);
    
    // List all tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    console.log('\nCreated tables:');
    if (tables && tables.length > 0) {
      tables.forEach(table => {
        console.log(`  ✓ ${table}`);
      });
    } else {
      console.log('  No tables found');
    }

    await sequelize.close();
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
