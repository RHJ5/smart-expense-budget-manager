const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Step 1: Check karo email pehle se hai ya nahi
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ye email pehle se registered hai' });
    }

    // Step 2: Password hash karo
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 3: Naya user banao
    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });

    // Step 4: Success response (password hash kabhi wapas mat bhejo)
    res.status(201).json({
      message: 'User successfully register ho gaya',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: User dhoondo email se
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    // Step 2: Password compare karo
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    // Step 3: JWT token banao
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 4: Token wapas bhejo
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { register, login };