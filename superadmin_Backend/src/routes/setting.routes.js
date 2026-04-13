const express = require('express');
const settingController = require('../controllers/setting.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings);

module.exports = router;
