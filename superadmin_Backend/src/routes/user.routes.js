const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/status', userController.updateUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
