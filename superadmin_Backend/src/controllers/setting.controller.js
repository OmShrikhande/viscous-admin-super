const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { db } = require('../config/firebase');

const defaultSettings = {
  trackingInterval: 15,
  notificationRules: {
    emailAlerts: true,
    smsAlerts: false,
    dailyReports: true,
    weeklyReports: true,
  },
  featureToggles: {
    maintenanceMode: false,
    betaFeatures: true,
    publicRegistration: false,
    apiAccess: true,
    analyticsDashboard: true,
    auditLogging: true,
  }
};

const getSettings = asyncHandler(async (req, res) => {
  const docRef = db.collection('settings').doc('global');
  const docSnap = await docRef.get();

  let settings = defaultSettings;

  if (docSnap.exists) {
    settings = docSnap.data();
  } else {
    // Seed it the first time
    await docRef.set(defaultSettings);
  }

  res.status(200).send(new ApiResponse(true, 'Settings retrieved successfully', settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const newSettings = req.body;
  const docRef = db.collection('settings').doc('global');
  
  await docRef.set({ ...newSettings, updatedAt: new Date().toISOString() }, { merge: true });

  const docSnap = await docRef.get();

  res.status(200).send(new ApiResponse(true, 'Settings updated successfully', docSnap.data()));
});

module.exports = {
  getSettings,
  updateSettings
};
