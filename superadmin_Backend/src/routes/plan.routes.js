const express = require('express');
const planController = require('../controllers/plan.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

module.exports = router;
