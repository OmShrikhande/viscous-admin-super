const express = require('express');
const userController = require('../../controllers/controller/user.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.route('/')
  .get(userController.getUsers)
  .post(userController.addUser);

router.route('/:id')
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
