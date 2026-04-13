const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceController.createInvoice);
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

module.exports = router;
