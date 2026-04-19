const express = require('express');
const routeController = require('../../controllers/controller/route.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.route('/')
  .get(routeController.getRoutes)
  .post(routeController.addRoute);

router.route('/:id')
  .put(routeController.updateRoute)
  .delete(routeController.deleteRoute);

module.exports = router;
