const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);

module.exports = router;