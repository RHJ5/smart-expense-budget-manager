const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/insightsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getInsights);

module.exports = router;