const sequelize = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

async function testAllModels() {
  try {
    await sequelize.authenticate();
    console.log('✅ Sab models load ho gaye, koi error nahi.');
    console.log('Models:', Object.keys(sequelize.models));
  } catch (error) {
    console.error('❌ Masla:', error);
  } finally {
    await sequelize.close();
  }
}

testAllModels();