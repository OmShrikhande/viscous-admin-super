const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { db } = require('../config/firebase');

const getAllLogs = asyncHandler(async (req, res) => {
  const snapshot = await db.collection('audit_logs')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

  const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Audit logs retrieved successfully', logs));
});

module.exports = {
  getAllLogs
};
