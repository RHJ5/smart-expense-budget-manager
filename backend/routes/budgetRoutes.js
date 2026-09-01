const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);
router.get('/', authMiddleware, getBudgets);
router.post('/', authMiddleware, createBudget);

module.exports = router;