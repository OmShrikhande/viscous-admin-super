const express = require('express');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth'); // assuming we might need it later

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
