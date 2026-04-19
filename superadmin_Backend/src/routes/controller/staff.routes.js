const express = require('express');
const staffController = require('../../controllers/controller/staff.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.get('/', staffController.getStaff);

module.exports = router;
