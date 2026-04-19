const { admin, db } = require('../config/firebase');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

const controllerAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Please authenticate');
  }

  const token = authHeader.split(' ')[1];
  try {
    // 1. Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Fetch User metadata from 'admins' collection
    const adminDoc = await db.collection('admins').doc(uid).get();
    
    if (!adminDoc.exists) {
      throw new ApiError(403, 'Unauthorized access: User not found in system');
    }

    const adminData = adminDoc.data();
    
    // 3. Role Check (Allow Super Admin or Controller)
    const isSuperAdmin = adminData.role === 'super_admin' || decodedToken.role === 'super_admin';
    const isController = adminData.role === 'controller';

    if (!isSuperAdmin && !isController) {
      throw new ApiError(403, 'Permission denied: Controller or Super Admin role required');
    }

    // 4. College Context & Plan Check
    let planExpired = false;
    let collegeName = adminData.college;

    if (isController) {
      if (!collegeName || collegeName === 'Unassigned') {
        throw new ApiError(403, 'Account not associated with any college');
      }

      const collegeSnap = await db.collection('colleges')
        .where('name', '==', collegeName)
        .limit(1)
        .get();

      if (collegeSnap.empty) {
        throw new ApiError(404, 'Associated college not found');
      }

      const collegeData = collegeSnap.docs[0].data();
      if (collegeData.planExpiryDate) {
        const expiry = new Date(collegeData.planExpiryDate);
        const now = new Date();
        if (expiry < now) {
          planExpired = true;
        }
      }
    }

    // Attach to request
    req.user = {
      uid,
      email: decodedToken.email,
      role: adminData.role,
      college: collegeName,
      planExpired,
      isSuperAdmin
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Invalid or expired token');
  }
});

module.exports = controllerAuth;
