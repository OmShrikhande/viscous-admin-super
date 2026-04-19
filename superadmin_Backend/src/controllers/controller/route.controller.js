const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get all routes for the college
 * @route   GET /api/v1/controller/routes
 */
const getRoutes = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  let query = db.collection('routes');
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.get();
  const routes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Routes retrieved successfully', routes));
});

/**
 * @desc    Add a new route
 * @route   POST /api/v1/controller/routes
 */
const addRoute = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { college } = req.user;
  const routeData = {
    ...req.body,
    college,
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('routes').add(routeData);
  
  res.status(201).send(new ApiResponse(true, 'Route added successfully', { id: docRef.id, ...routeData }));
});

/**
 * @desc    Update route details
 * @route   PUT /api/v1/controller/routes/:id
 */
const updateRoute = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;
  
  const docRef = db.collection('routes').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Route not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  const updateData = { ...req.body, updatedAt: new Date().toISOString() };
  delete updateData.college;

  await docRef.update(updateData);
  res.status(200).send(new ApiResponse(true, 'Route updated successfully', { id, ...updateData }));
});

/**
 * @desc    Delete a route
 * @route   DELETE /api/v1/controller/routes/:id
 */
const deleteRoute = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const docRef = db.collection('routes').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Route not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  await docRef.delete();
  res.status(200).send(new ApiResponse(true, 'Route deleted successfully'));
});

module.exports = {
  getRoutes,
  addRoute,
  updateRoute,
  deleteRoute
};
