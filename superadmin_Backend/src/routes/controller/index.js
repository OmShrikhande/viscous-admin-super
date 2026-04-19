const express = require('express');
const busRoutes = require('./bus.routes');
const driverRoutes = require('./driver.routes');
const routeRoutes = require('./route.routes');
const analyticsRoutes = require('./analytics.routes');
const staffRoutes = require('./staff.routes');
const notificationRoutes = require('./notification.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.use('/buses', busRoutes);
router.use('/drivers', driverRoutes);
router.use('/routes', routeRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/staff', staffRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);

module.exports = router;
