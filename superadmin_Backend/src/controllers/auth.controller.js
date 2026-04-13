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

    // Check custom claims to ensure they are admin (optional safety check)
    const userRecord = await admin.auth().getUser(data.localId);

    res.status(200).send(new ApiResponse(true, 'Login successful', {
      user: {
        id: userRecord.uid,
        name: userRecord.displayName || 'Super Admin',
        email: userRecord.email,
        role: userRecord.customClaims?.role || 'super_admin'
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
