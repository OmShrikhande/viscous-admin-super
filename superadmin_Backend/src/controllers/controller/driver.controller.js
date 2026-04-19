const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get all drivers for the college
 * @route   GET /api/v1/controller/drivers
 */
const getDrivers = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  let query = db.collection('drivers');
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.get();
  const drivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Drivers retrieved successfully', drivers));
});

/**
 * @desc    Add a new driver
 * @route   POST /api/v1/controller/drivers
 */
const addDriver = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { college } = req.user;
  const driverData = {
    ...req.body,
    college,
    status: req.body.status || 'active',
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('drivers').add(driverData);
  
  res.status(201).send(new ApiResponse(true, 'Driver added successfully', { id: docRef.id, ...driverData }));
});

/**
 * @desc    Update driver details
 * @route   PUT /api/v1/controller/drivers/:id
 */
const updateDriver = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;
  
  const docRef = db.collection('drivers').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Driver not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  const updateData = { ...req.body, updatedAt: new Date().toISOString() };
  delete updateData.college;

  await docRef.update(updateData);
  res.status(200).send(new ApiResponse(true, 'Driver updated successfully', { id, ...updateData }));
});

/**
 * @desc    Delete a driver
 * @route   DELETE /api/v1/controller/drivers/:id
 */
const deleteDriver = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const docRef = db.collection('drivers').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Driver not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  await docRef.delete();
  res.status(200).send(new ApiResponse(true, 'Driver deleted successfully'));
});

module.exports = {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver
};
