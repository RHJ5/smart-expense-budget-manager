const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');

async function getDashboardSummary(req, res) {
  try {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startDate = `${currentPeriod}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const endDate = `${currentPeriod}-${lastDay}`;

    const totalIncome = await Transaction.sum('amount', {
      where: {
        userId: req.userId,
        type: 'income',
        date: { [Op.between]: [startDate, endDate] },
      },
    }) || 0;

    const totalExpenses = await Transaction.sum('amount', {
      where: {
        userId: req.userId,
        type: 'expense',
        date: { [Op.between]: [startDate, endDate] },
      },
    }) || 0;

    const balance = totalIncome - totalExpenses;

    const recentTransactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']],
      limit: 5,
    });

    res.status(200).json({
      period: currentPeriod,
      totalIncome,
      totalExpenses,
      balance,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getDashboardSummary };