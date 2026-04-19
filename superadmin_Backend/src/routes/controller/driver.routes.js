const express = require('express');
const driverController = require('../../controllers/controller/driver.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.route('/')
  .get(driverController.getDrivers)
  .post(driverController.addDriver);

router.route('/:id')
  .put(driverController.updateDriver)
  .delete(driverController.deleteDriver);

module.exports = router;
