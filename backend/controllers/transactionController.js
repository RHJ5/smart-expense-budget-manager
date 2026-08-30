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
async function getTransactions(req, res) {
  try {
    const { type, categoryId, startDate, endDate, sortBy, page, limit } = req.query;

    const where = { userId: req.userId };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const currentPage = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (currentPage - 1) * pageSize;

    let order = [['date', 'DESC']];
    if (sortBy === 'oldest') order = [['date', 'ASC']];
    if (sortBy === 'highest') order = [['amount', 'DESC']];
    if (sortBy === 'lowest') order = [['amount', 'ASC']];

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order,
      limit: pageSize,
      offset,
    });

    res.status(200).json({
      transactions: rows,
      totalCount: count,
      currentPage,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
async function getTransactionById(req, res) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction nahi mila' });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction nahi mila' });
    }

    const { categoryId, type, amount, description, date } = req.body;

    await transaction.update({ categoryId, type, amount, description, date });

    res.status(200).json({ message: 'Transaction update ho gaya', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction nahi mila' });
    }

    await transaction.destroy();

    res.status(200).json({ message: 'Transaction delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };