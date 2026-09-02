const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'preferredCurrency', 'createdAt'],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, preferredCurrency } = req.body;
    await user.update({ name, preferredCurrency });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getProfile, updateProfile };