const express = require('express');
const busController = require('../../controllers/controller/bus.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.route('/')
  .get(busController.getBuses)
  .post(busController.addBus);

router.route('/:id')
  .get(busController.getBusById)
  .put(busController.updateBus)
  .delete(busController.deleteBus);

module.exports = router;
