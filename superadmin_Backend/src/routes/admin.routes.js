const express = require('express');
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', adminController.getAllAdmins);
router.post('/', adminController.createAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.patch('/:id/status', adminController.updateAdminStatus);

module.exports = router;
