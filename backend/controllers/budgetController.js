const { Op } = require('sequelize');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

async function createBudget(req, res) {
  try {
    const { categoryId, amount, startDate, endDate } = req.body;

    const newBudget = await Budget.create({
      userId: req.userId,
      categoryId,
      amount,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: 'Budget created successfully',
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
      order: [['startDate', 'DESC']],
    });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.sum('amount', {
          where: {
            userId: req.userId,
            categoryId: budget.categoryId,
            type: 'expense',
            date: { [Op.between]: [budget.startDate, budget.endDate] },
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
          startDate: budget.startDate,
          endDate: budget.endDate,
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

async function updateBudget(req, res) {
  try {
    const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const { categoryId, amount, startDate, endDate } = req.body;
    await budget.update({ categoryId, amount, startDate, endDate });

    res.status(200).json({ message: 'Budget updated successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function deleteBudget(req, res) {
  try {
    const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await budget.destroy();
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };