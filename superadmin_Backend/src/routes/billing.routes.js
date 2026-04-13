const express = require('express');
const billingController = require('../controllers/billing.controller');

const router = express.Router();

router.get('/', billingController.getStub);

module.exports = router;
