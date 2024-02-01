const express = require('express');
const router = express.Router();
const totalController = require('../controllers/totalController');

router.get('/total-revenue', totalController.getTotalRevenue);

module.exports = router;
