const express = require('express');
const collegeController = require('../controllers/college.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', collegeController.getAllColleges);
router.get('/:id', collegeController.getCollegeById);
router.post('/', collegeController.createCollege);
router.put('/:id', collegeController.updateCollege);
router.delete('/:id', collegeController.deleteCollege);

module.exports = router;
