const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/policy-stats', statsController.getPolicyStats);

module.exports = router;
