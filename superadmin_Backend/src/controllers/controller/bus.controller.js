const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get all buses for the college
 * @route   GET /api/v1/controller/buses
 * @access  Private (Controller/Super Admin)
 */
const getBuses = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  let query = db.collection('buses');
  
  // If not super admin, filter by college
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.get();
  const buses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Buses retrieved successfully', buses));
});

/**
 * @desc    Get single bus details
 * @route   GET /api/v1/controller/buses/:id
 */
const getBusById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const doc = await db.collection('buses').doc(id).get();

  if (!doc.exists) {
    throw new ApiError(404, 'Bus not found');
  }

  const busData = doc.data();

  // Security check: Ensure bus belongs to the same college
  if (!isSuperAdmin && busData.college !== college) {
    throw new ApiError(403, 'Access denied: Bus belongs to another institution');
  }

  res.status(200).send(new ApiResponse(true, 'Bus details retrieved', { id: doc.id, ...busData }));
});

/**
 * @desc    Add a new bus
 * @route   POST /api/v1/controller/buses
 */
const addBus = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { college } = req.user;
  const busData = {
    ...req.body,
    college,
    status: req.body.status || 'active',
    lastMaintenance: req.body.lastMaintenance || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('buses').add(busData);
  
  res.status(201).send(new ApiResponse(true, 'Bus added successfully', { id: docRef.id, ...busData }));
});

/**
 * @desc    Update bus details
 * @route   PUT /api/v1/controller/buses/:id
 */
const updateBus = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;
  
  const docRef = db.collection('buses').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Bus not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied: Cannot update bus from another institution');
  }

  const updateData = {
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  // Prevent changing the college of a bus
  delete updateData.college;

  await docRef.update(updateData);

  res.status(200).send(new ApiResponse(true, 'Bus updated successfully', { id, ...updateData }));
});

/**
 * @desc    Delete a bus
 * @route   DELETE /api/v1/controller/buses/:id
 */
const deleteBus = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const docRef = db.collection('buses').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Bus not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied: Cannot delete bus from another institution');
  }

  await docRef.delete();

  res.status(200).send(new ApiResponse(true, 'Bus deleted successfully'));
});

module.exports = {
  getBuses,
  getBusById,
  addBus,
  updateBus,
  deleteBus
};
