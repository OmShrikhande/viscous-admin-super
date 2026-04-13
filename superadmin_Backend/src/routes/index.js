const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const collegeRoutes = require('./college.routes');
const adminRoutes = require('./admin.routes');
const userRoutes = require('./user.routes');
const planRoutes = require('./plan.routes');
const invoiceRoutes = require('./invoice.routes');
const reportRoutes = require('./report.routes');
const settingRoutes = require('./setting.routes');
const logRoutes = require('./log.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/colleges', collegeRoutes);
router.use('/admins', adminRoutes);
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingRoutes);
router.use('/logs', logRoutes);

module.exports = router;
