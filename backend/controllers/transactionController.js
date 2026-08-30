const Transaction = require('../models/Transaction');

async function createTransaction(req, res) {
  try {
    const { categoryId, type, amount, description, date } = req.body;

    const newTransaction = await Transaction.create({
      userId: req.userId,
      categoryId,
      type,
      amount,
      description,
      date,
    });

    res.status(201).json({
      message: 'Transaction ban gaya',
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { createTransaction };