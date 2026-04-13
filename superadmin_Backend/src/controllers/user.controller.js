const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { admin, db } = require('../config/firebase');

const getAllUsers = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('users')
    .orderBy('createdAt', 'desc')
    .limit(50) // Pagination baseline mapped
    .get();

  const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Users retrieved successfully', usersList));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const docRef = db.collection('users').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).send(new ApiResponse(true, 'User retrieved successfully', { id: docSnap.id, ...docSnap.data() }));
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, action } = req.body; 

  const docRef = db.collection('users').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'User not found');
  }

  let finalStatus = docSnap.data().status;

  if (action === 'suspend') {
    await admin.auth().updateUser(id, { disabled: true });
    finalStatus = 'suspended';
  } else if (action === 'activate') {
    await admin.auth().updateUser(id, { disabled: false });
    finalStatus = 'active';
  } else if (status) {
    finalStatus = status;
  }

  await docRef.update({ status: finalStatus, updatedAt: new Date().toISOString() });

  res.status(200).send(new ApiResponse(true, `User status updated to ${finalStatus}`, { id, status: finalStatus }));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await admin.auth().deleteUser(id);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }

  await db.collection('users').doc(id).delete();

  res.status(200).send(new ApiResponse(true, 'User permanently deleted'));
});


module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
};
