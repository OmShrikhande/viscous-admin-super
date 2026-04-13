const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { db } = require('../config/firebase');

const getAllInvoices = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('invoices')
    .orderBy('issuedDate', 'desc')
    .limit(50)
    .get();

  const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(new ApiResponse(true, 'Invoices retrieved successfully', invoices));
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection('invoices').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) throw new ApiError(404, 'Invoice not found');

  res.status(200).send(new ApiResponse(true, 'Invoice retrieved successfully', { id: docSnap.id, ...docSnap.data() }));
});

const createInvoice = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.college || !payload.amount) {
     throw new ApiError(400, 'Invoice requires at least college association and amount');
  }

  payload.issuedDate = payload.issuedDate || new Date().toISOString();
  payload.status = payload.status || 'pending';

  const docRef = await db.collection('invoices').add(payload);

  res.status(201).send(new ApiResponse(true, 'Invoice created successfully', { id: docRef.id, ...payload }));
});

const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const docRef = db.collection('invoices').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'Invoice not found');
  }

  await docRef.update({ status, updatedAt: new Date().toISOString() });

  res.status(200).send(new ApiResponse(true, `Invoice updated to ${status}`, { id, status }));
});

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus
};
