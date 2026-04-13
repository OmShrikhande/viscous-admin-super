const fs = require('fs');
const path = require('path');

const srcPath = 'c:/projects/viscous admin/superadmin_Backend/src';
const controllersPath = path.join(srcPath, 'controllers');
const routesPath = path.join(srcPath, 'routes');

const modules = [
  'auth', 'dashboard', 'college', 'admin', 'user', 
  'billing', 'report', 'setting', 'log'
];

fs.mkdirSync(controllersPath, { recursive: true });
fs.mkdirSync(routesPath, { recursive: true });

modules.forEach(mod => {
  // Controller Stub
  const controllerContent = `const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getStub = asyncHandler(async (req, res) => {
  res.status(200).send(new ApiResponse(true, '${mod} endpoint hit'));
});

module.exports = {
  getStub
};
`;
  fs.writeFileSync(path.join(controllersPath, `${mod}.controller.js`), controllerContent);

  // Route Stub
  const routeContent = `const express = require('express');
const ${mod}Controller = require('../controllers/${mod}.controller');

const router = express.Router();

router.get('/', ${mod}Controller.getStub);

module.exports = router;
`;
  fs.writeFileSync(path.join(routesPath, `${mod}.routes.js`), routeContent);
});

// Index Route
const indexRouteContent = `const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const collegeRoutes = require('./college.routes');
const adminRoutes = require('./admin.routes');
const userRoutes = require('./user.routes');
const billingRoutes = require('./billing.routes');
const reportRoutes = require('./report.routes');
const settingRoutes = require('./setting.routes');
const logRoutes = require('./log.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/colleges', collegeRoutes);
router.use('/admins', adminRoutes);
router.use('/users', userRoutes);
router.use('/billing', billingRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingRoutes);
router.use('/logs', logRoutes);

module.exports = router;
`;

fs.writeFileSync(path.join(routesPath, 'index.js'), indexRouteContent);

console.log('Stubs created successfully!');
