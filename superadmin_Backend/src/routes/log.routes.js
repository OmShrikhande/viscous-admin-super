const express = require('express');
const logController = require('../controllers/log.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', logController.getAllLogs);

module.exports = router;
