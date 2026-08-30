const { Op } = require('sequelize');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

function getMonthDateRange(period) {
  const [year, month] = period.split('-');
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${month}-${lastDay}`;
  return { startDate, endDate };
}

async function createBudget(req, res) {
  try {
    const { categoryId, amount, period } = req.body;

    const newBudget = await Budget.create({
      userId: req.userId,
      categoryId,
      amount,
      period,
    });

    res.status(201).json({
      message: 'Budget ban gaya',
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getBudgets(req, res) {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.userId },
    });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const { startDate, endDate } = getMonthDateRange(budget.period);

        const spent = await Transaction.sum('amount', {
          where: {
            userId: req.userId,
            categoryId: budget.categoryId,
            type: 'expense',
            date: { [Op.between]: [startDate, endDate] },
          },
        }) || 0;

        const remaining = budget.amount - spent;
        const percentageUsed = (spent / budget.amount) * 100;

        let status = 'under budget';
        if (percentageUsed >= 100) status = 'exceeded';
        else if (percentageUsed >= 80) status = 'near limit';

        return {
          id: budget.id,
          categoryId: budget.categoryId,
          amount: budget.amount,
          period: budget.period,
          spent,
          remaining,
          percentageUsed: Math.round(percentageUsed),
          status,
        };
      })
    );

    res.status(200).json({ budgets: budgetsWithSpending });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getBudgets, createBudget };