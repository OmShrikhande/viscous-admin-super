const admin = require('firebase-admin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Please authenticate');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

module.exports = verifyToken;
