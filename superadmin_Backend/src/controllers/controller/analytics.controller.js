const asyncHandler = require('../../middleware/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { db } = require('../../config/firebase');

/**
 * @desc    Get dashboard metrics for the college
 * @route   GET /api/v1/controller/analytics
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const { college, isSuperAdmin } = req.user;
  
  // Aggregation counts
  const [busesSnap, driversSnap, routesSnap] = await Promise.all([
    db.collection('buses').where('college', '==', college).count().get(),
    db.collection('drivers').where('college', '==', college).count().get(),
    db.collection('routes').where('college', '==', college).count().get()
  ]);

  const stats = {
    totalBuses: busesSnap.data().count,
    totalDrivers: driversSnap.data().count,
    totalRoutes: routesSnap.data().count,
    activeTrips: 0, // Placeholder for real-time data
    systemStatus: 'healthy',
    fuelConsumption: {
      weekly: [120, 150, 110, 180, 200, 140, 130],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  res.status(200).send(new ApiResponse(true, 'Analytics retrieved successfully', stats));
});

module.exports = {
  getAnalytics
};
