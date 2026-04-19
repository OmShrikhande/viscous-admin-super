const express = require('express');
const analyticsController = require('../../controllers/controller/analytics.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.get('/', analyticsController.getAnalytics);

module.exports = router;
