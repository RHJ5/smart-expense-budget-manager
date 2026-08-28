const sequelize = require('./config/database');
const User = require('./models/User');

async function testUserModel() {
  try {
    // Database se connect karo
    await sequelize.authenticate();
    console.log('✅ Database se connection theek hai.');

    // Ek naya user banao
    const newUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      passwordHash: 'this_is_a_fake_hash_for_now',
    });

    console.log('✅ Naya user ban gaya:', newUser.toJSON());
  } catch (error) {
    console.error('❌ Kuch masla hua:', error);
  } finally {
    await sequelize.close();
  }
}

testUserModel();