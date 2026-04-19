const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get all students/parents for the college
 * @route   GET /api/v1/controller/users
 */
const getUsers = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  let query = db.collection('users');
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(100).get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Users retrieved successfully', users));
});

/**
 * @desc    Add a new student/parent
 * @route   POST /api/v1/controller/users
 */
const addUser = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { college } = req.user;
  const userData = {
    ...req.body,
    college,
    status: req.body.status || 'active',
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('users').add(userData);
  
  res.status(201).send(new ApiResponse(true, 'User added successfully', { id: docRef.id, ...userData }));
});

/**
 * @desc    Update user details
 * @route   PUT /api/v1/controller/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;
  
  const docRef = db.collection('users').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'User not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  const updateData = { ...req.body, updatedAt: new Date().toISOString() };
  delete updateData.college;

  await docRef.update(updateData);
  res.status(200).send(new ApiResponse(true, 'User updated successfully', { id, ...updateData }));
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/v1/controller/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const docRef = db.collection('users').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'User not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  await docRef.delete();
  res.status(200).send(new ApiResponse(true, 'User deleted successfully'));
});

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser
};
