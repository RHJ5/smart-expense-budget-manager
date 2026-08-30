require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Expense & Budget Manager API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/protected-test', authMiddleware, (req, res) => {
  res.json({ message: 'Aap authenticated hain!', userId: req.userId });
});

app.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai port ${PORT} par`);
});