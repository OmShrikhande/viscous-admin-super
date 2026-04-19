const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const { db } = require('../../config/firebase');

/**
 * @desc    Get all notifications for the college
 * @route   GET /api/v1/controller/notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  let query = db.collection('notifications');
  if (!isSuperAdmin) {
    query = query.where('college', '==', college);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(50).get();
  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).send(new ApiResponse(true, 'Notifications retrieved successfully', notifications));
});

/**
 * @desc    Add a new notification
 * @route   POST /api/v1/controller/notifications
 */
const addNotification = asyncHandler(async (req, res) => {
  if (req.user.planExpired && !req.user.isSuperAdmin) {
    throw new ApiError(403, 'Action blocked: College plan has expired');
  }

  const { college } = req.user;
  const notificationData = {
    ...req.body,
    college,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  const docRef = await db.collection('notifications').add(notificationData);
  
  res.status(201).send(new ApiResponse(true, 'Notification added successfully', { id: docRef.id, ...notificationData }));
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/v1/controller/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { college, isSuperAdmin } = req.user;

  const docRef = db.collection('notifications').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new ApiError(404, 'Notification not found');
  }

  if (!isSuperAdmin && doc.data().college !== college) {
    throw new ApiError(403, 'Access denied');
  }

  await docRef.update({ isRead: true });
  res.status(200).send(new ApiResponse(true, 'Notification marked as read'));
});

module.exports = {
  getNotifications,
  addNotification,
  markAsRead
};
