const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createTransaction);

module.exports = router;