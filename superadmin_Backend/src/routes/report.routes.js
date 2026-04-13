const express = require('express');
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/summary', reportController.getReportSummary);

module.exports = router;
