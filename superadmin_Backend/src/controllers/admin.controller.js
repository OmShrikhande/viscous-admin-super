const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { admin, db } = require('../config/firebase');

const getAllAdmins = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('admins')
    .orderBy('createdAt', 'desc')
    .get();

  const adminsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Admins retrieved successfully', adminsList));
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, college, permissions } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  // 1. Create user in Firebase Auth
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  // 2. Set Custom Claims
  await admin.auth().setCustomUserClaims(userRecord.uid, { role: role || 'admin' });

  // 3. Save metadata to Firestore using Auth UID as Document ID
  const payload = {
    name,
    email,
    role: role || 'admin',
    college: college || 'Unassigned',
    permissions: permissions || [],
    status: 'active',
    createdAt: new Date().toISOString()
  };

  await db.collection('admins').doc(userRecord.uid).set(payload);

  res.status(201).send(new ApiResponse(true, 'Admin created successfully', { id: userRecord.uid, ...payload }));
});

const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, college, permissions } = req.body;

  const docRef = db.collection('admins').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'Admin not found');
  }

  // Optional: Update Firebase Auth name if provided
  if (name && name !== docSnap.data().name) {
    await admin.auth().updateUser(id, { displayName: name });
  }
  
  if (role && role !== docSnap.data().role) {
    await admin.auth().setCustomUserClaims(id, { role });
  }

  const updateData = { updatedAt: new Date().toISOString() };
  if (name !== undefined) updateData.name = name;
  if (role !== undefined) updateData.role = role;
  if (college !== undefined) updateData.college = college;
  if (permissions !== undefined) updateData.permissions = permissions;

  await docRef.update(updateData);

  res.status(200).send(new ApiResponse(true, 'Admin updated successfully', { id, ...docSnap.data(), ...updateData }));
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await admin.auth().deleteUser(id);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }

  await db.collection('admins').doc(id).delete();

  res.status(200).send(new ApiResponse(true, 'Admin permanently deleted'));
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, action } = req.body; // action can be 'activate', 'deactivate', 'revoke'

  const docRef = db.collection('admins').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new ApiError(404, 'Admin not found');
  }

  let finalStatus = docSnap.data().status;

  if (action === 'activate') {
    await admin.auth().updateUser(id, { disabled: false });
    finalStatus = 'active';
  } else if (action === 'deactivate') {
    await admin.auth().updateUser(id, { disabled: true });
    finalStatus = 'suspended';
  } else if (action === 'revoke') {
    await admin.auth().updateUser(id, { disabled: true });
    await admin.auth().revokeRefreshTokens(id);
    finalStatus = 'revoked';
  } else if (status) {
    finalStatus = status;
  }

  await docRef.update({ status: finalStatus, updatedAt: new Date().toISOString() });

  res.status(200).send(new ApiResponse(true, `Admin status updated to ${finalStatus}`, { id, status: finalStatus }));
});

module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminStatus
};
