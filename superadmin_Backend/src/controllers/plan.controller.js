const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { db } = require('../config/firebase');

const getAllPlans = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('plans').get();
  const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).send(new ApiResponse(true, 'Plans retrieved successfully', plans));
});

const getPlanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection('plans').doc(id);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    throw new ApiError(404, 'Plan not found');
  }

  res.status(200).send(new ApiResponse(true, 'Plan retrieved successfully', { id: docSnap.id, ...docSnap.data() }));
});

const createPlan = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.name || payload.price === undefined) {
    throw new ApiError(400, 'Plan requires at least a name and price.');
  }

  payload.createdAt = new Date().toISOString();
  payload.status = payload.status || 'active';
  
  const docRef = await db.collection('plans').add(payload);
  
  res.status(201).send(new ApiResponse(true, 'Plan created successfully', { id: docRef.id, ...payload }));
});

const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const docRef = db.collection('plans').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) throw new ApiError(404, 'Plan not found');

  updateData.updatedAt = new Date().toISOString();
  await docRef.update(updateData);

  res.status(200).send(new ApiResponse(true, 'Plan updated successfully', { id, ...docSnap.data(), ...updateData }));
});

const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection('plans').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) throw new ApiError(404, 'Plan not found');

  await docRef.delete();

  res.status(200).send(new ApiResponse(true, 'Plan permanently deleted'));
});

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
};
