const express = require('express');
const notificationController = require('../../controllers/controller/notification.controller');
const controllerAuth = require('../../middleware/controllerAuth');

const router = express.Router();

router.use(controllerAuth);

router.route('/')
  .get(notificationController.getNotifications)
  .post(notificationController.addNotification);

router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
