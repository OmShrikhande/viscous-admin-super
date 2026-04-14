const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const { admin } = require('../config/firebase');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  try {
    // Authenticate with Firebase REST API using backend API key
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && data.error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
         throw new ApiError(401, 'Invalid email or password');
      }
      throw new ApiError(401, data.error ? data.error.message : 'Invalid email or password');
    }

    // 1. Get user record from Auth
    const userRecord = await admin.auth().getUser(data.localId);

    // 2. Fetch user metadata from Firestore 'admins' collection
    const { db } = require('../config/firebase');
    const adminDoc = await db.collection('admins').doc(data.localId).get();
    
    let permissions = [];
    let planExpired = false;
    let collegeData = null;

    if (adminDoc.exists) {
      const adminData = adminDoc.data();
      permissions = adminData.permissions || [];
      
      // 3. If controller, check college plan status
      if (adminData.role === 'controller' && adminData.college && adminData.college !== 'Unassigned') {
        const collegeSnap = await db.collection('colleges')
          .where('name', '==', adminData.college)
          .limit(1)
          .get();

        if (!collegeSnap.empty) {
          collegeData = collegeSnap.docs[0].data();
          if (collegeData.planExpiryDate) {
            const expiry = new Date(collegeData.planExpiryDate);
            const now = new Date();
            if (expiry < now) {
              planExpired = true;
            }
          }
        }
      }
    }

    res.status(200).send(new ApiResponse(true, 'Login successful', {
      user: {
        id: userRecord.uid,
        name: userRecord.displayName || (adminDoc.exists ? adminDoc.data().name : 'User'),
        email: userRecord.email,
        role: userRecord.customClaims?.role || 'super_admin',
        college: adminDoc.exists ? adminDoc.data().college : null,
        permissions,
        planExpired
      },
      accessToken: data.idToken,
      refreshToken: data.refreshToken
    }));

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, error.message || 'Invalid email or password');
  }
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).send(new ApiResponse(true, 'Logged out successfully'));
});

module.exports = {
  login,
  logout
};
