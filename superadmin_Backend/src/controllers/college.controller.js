const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { db } = require('../config/firebase');

const getAllColleges = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('colleges')
    .orderBy('createdAt', 'desc')
    .get();

  const collegesPromises = snapshot.docs.map(async (doc) => {
    const data = doc.data();
    
    const [adminsCountSnap, usersCountSnap] = await Promise.all([
      db.collection('admins').where('college', '==', data.name).count().get(),
      db.collection('users').where('college', '==', data.name).count().get()
    ]);

    return {
      id: doc.id,
      ...data,
      controllers: adminsCountSnap.data().count,
      users: usersCountSnap.data().count
    };
  });

  const colleges = await Promise.all(collegesPromises);

  res.status(200).send(new ApiResponse(true, 'Colleges retrieved successfully', colleges));
});

const getCollegeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection('colleges').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'College not found');
  }

  const [adminsCountSnap, usersCountSnap] = await Promise.all([
    db.collection('admins').where('college', '==', docSnap.data().name).count().get(),
    db.collection('users').where('college', '==', docSnap.data().name).count().get()
  ]);

  res.status(200).send(new ApiResponse(true, 'College retrieved successfully', { 
    id: docSnap.id, 
    ...docSnap.data(),
    controllers: adminsCountSnap.data().count,
    users: usersCountSnap.data().count
  }));
});

const createCollege = asyncHandler(async (req, res) => {
  const { name, code, city, state, contactEmail, contactPhone, plan, status, address } = req.body;

  if (!name || !code) {
    throw new ApiError(400, 'Name and Code are required');
  }

  const payload = {
    name,
    code,
    city: city || '',
    state: state || '',
    contactEmail: contactEmail || '',
    contactPhone: contactPhone || '',
    plan: plan || 'Basic',
    planExpiryDate: req.body.planExpiryDate || '',
    status: status || 'active',
    address: address || '',
    buses: 0,
    controllers: 0,
    users: 0,
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('colleges').add(payload);
  
  res.status(201).send(new ApiResponse(true, 'College created successfully', { id: docRef.id, ...payload }));
});

const updateCollege = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const docRef = db.collection('colleges').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'College not found');
  }

  // Prevents rewriting metrics accidentally if supplied implicitly
  delete updateData.buses;
  delete updateData.controllers;
  delete updateData.users;
  delete updateData.createdAt;

  updateData.updatedAt = new Date().toISOString();

  // Handle planExpiryDate specifically if it exists in body
  if (req.body.planExpiryDate !== undefined) {
    updateData.planExpiryDate = req.body.planExpiryDate;
  }

  await docRef.update(updateData);

  res.status(200).send(new ApiResponse(true, 'College updated successfully', { id, ...docSnap.data(), ...updateData }));
});

const deleteCollege = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const docRef = db.collection('colleges').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'College not found');
  }

  await docRef.delete();

  res.status(200).send(new ApiResponse(true, 'College deleted successfully'));
});

// Currently unmapped in routes, but good logic chunk
const getCollegeStats = asyncHandler(async (req, res) => {
  res.status(200).send(new ApiResponse(true, 'College stats endpoint logic uninitialized', {}));
});

module.exports = {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeStats
};
