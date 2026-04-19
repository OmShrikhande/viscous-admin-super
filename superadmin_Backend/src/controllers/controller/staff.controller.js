const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get college staff/users
 * @route   GET /api/v1/controller/staff
 */
const getStaff = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  // Staff are stored in 'admins' but we only want those in the same college
  // Or 'users' if they are general staff. 
  // For the controller dashboard, 'staff' usually means sub-admins or college users.
  
  let query = db.collection('admins');
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.get();
  const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(u => u.role !== 'super_admin'); // Super admins aren't 'staff' for a college

  res.status(200).send(new ApiResponse(true, 'Staff retrieved successfully', staff));
});

module.exports = {
  getStaff
};
