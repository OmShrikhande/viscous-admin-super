const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken); // Dashboard requires authentication

router.get('/metrics', dashboardController.getMetrics);
router.get('/growth', dashboardController.getGrowth);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/alerts', dashboardController.getAlerts);

module.exports = router;
