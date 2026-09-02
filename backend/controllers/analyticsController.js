const { Op, fn, col } = require('sequelize');
const Transaction = require('../models/Transaction');

async function getExpenseByCategory(req, res) {
  try {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startDate = `${currentPeriod}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const endDate = `${currentPeriod}-${lastDay}`;

    const expenseByCategory = await Transaction.findAll({
      attributes: [
        'categoryId',
        [fn('SUM', col('amount')), 'total'],
      ],
      where: {
        userId: req.userId,
        type: 'expense',
        date: { [Op.between]: [startDate, endDate] },
      },
      group: ['categoryId'],
    });

    res.status(200).json({ expenseByCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getIncomeByCategory(req, res) {
  try {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startDate = `${currentPeriod}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const endDate = `${currentPeriod}-${lastDay}`;

    const incomeByCategory = await Transaction.findAll({
      attributes: [
        'categoryId',
        [fn('SUM', col('amount')), 'total'],
      ],
      where: {
        userId: req.userId,
        type: 'income',
        date: { [Op.between]: [startDate, endDate] },
      },
      group: ['categoryId'],
    });

    res.status(200).json({ incomeByCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
async function getMonthlyTrend(req, res) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const startDate = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;

    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId,
        date: { [Op.gte]: startDate },
      },
      attributes: ['type', 'amount', 'date'],
    });

    const monthlyData = {};

    transactions.forEach((t) => {
      const monthKey = t.date.toString().slice(0, 7); // "2026-08" nikalna date se

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else {
        monthlyData[monthKey].expense += parseFloat(t.amount);
      }
    });

    const result = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({ monthlyTrend: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}module.exports = { getExpenseByCategory, getMonthlyTrend, getIncomeByCategory };