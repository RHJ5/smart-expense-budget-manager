const express = require('express');
const router = express.Router();
const { getExpenseByCategory, getMonthlyTrend, getIncomeByCategory } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/expense-by-category', authMiddleware, getExpenseByCategory);
router.get('/monthly-trend', authMiddleware, getMonthlyTrend);
router.get('/income-by-category', authMiddleware, getIncomeByCategory);

module.exports = router;