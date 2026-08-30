const { Op, fn, col } = require('sequelize');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

async function getInsights(req, res) {
  try {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startDate = `${currentPeriod}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const endDate = `${currentPeriod}-${lastDay}`;

    const insights = [];

    const budgets = await Budget.findAll({ where: { userId: req.userId, period: currentPeriod } });

    for (const budget of budgets) {
      const spent = await Transaction.sum('amount', {
        where: {
          userId: req.userId,
          categoryId: budget.categoryId,
          type: 'expense',
          date: { [Op.between]: [startDate, endDate] },
        },
      }) || 0;

      const percentageUsed = (spent / budget.amount) * 100;

      if (percentageUsed >= 100) {
        insights.push(`Aap ne category ${budget.categoryId} ka budget exceed kar diya hai.`);
      } else if (percentageUsed >= 80) {
        insights.push(`Aap ne category ${budget.categoryId} ke budget ka ${Math.round(percentageUsed)}% use kar liya hai.`);
      }
    }

    const totalIncome = await Transaction.sum('amount', {
      where: { userId: req.userId, type: 'income', date: { [Op.between]: [startDate, endDate] } },
    }) || 0;

    const totalExpenses = await Transaction.sum('amount', {
      where: { userId: req.userId, type: 'expense', date: { [Op.between]: [startDate, endDate] } },
    }) || 0;

    if (totalExpenses > totalIncome) {
      insights.push('Is mahine aap ke expenses income se zyada hain.');
    }

    const topCategory = await Transaction.findAll({
      attributes: ['categoryId', [fn('SUM', col('amount')), 'total']],
      where: { userId: req.userId, type: 'expense', date: { [Op.between]: [startDate, endDate] } },
      group: ['categoryId'],
      order: [[fn('SUM', col('amount')), 'DESC']],
      limit: 1,
    });

    if (topCategory.length > 0) {
      insights.push(`Is mahine sabse zyada kharch category ${topCategory[0].categoryId} mein hua hai.`);
    }

    res.status(200).json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getInsights };