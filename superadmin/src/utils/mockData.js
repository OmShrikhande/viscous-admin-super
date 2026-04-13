// ─── Mock Data for the Super Admin Dashboard ─────────────────

export const mockMetrics = {
  totalColleges: 48,
  activeAdmins: 124,
  inactiveAdmins: 18,
  totalBuses: 312,
  totalUsers: 8420,
  systemHealth: 98.7,
};

export const mockGrowthData = [
  { month: 'Jan', colleges: 35, users: 5200, admins: 98 },
  { month: 'Feb', colleges: 37, users: 5800, admins: 102 },
  { month: 'Mar', colleges: 39, users: 6100, admins: 106 },
  { month: 'Apr', colleges: 41, users: 6700, admins: 110 },
  { month: 'May', colleges: 43, users: 7200, admins: 115 },
  { month: 'Jun', colleges: 45, users: 7800, admins: 119 },
  { month: 'Jul', colleges: 48, users: 8420, admins: 124 },
];

export const mockStatusDistribution = [
  { name: 'Active', value: 38, color: '#10b981' },
  { name: 'Inactive', value: 7, color: '#f59e0b' },
  { name: 'Suspended', value: 3, color: '#ef4444' },
];

export const mockRecentActivity = [
  { id: 1, action: 'New college registered', target: 'IIT Delhi', actor: 'System', time: '2026-03-27T22:30:00', type: 'create' },
  { id: 2, action: 'Admin deactivated', target: 'Rahul Sharma', actor: 'Super Admin', time: '2026-03-27T21:15:00', type: 'warning' },
  { id: 3, action: 'Plan assigned', target: 'NIT Warangal', actor: 'Super Admin', time: '2026-03-27T20:00:00', type: 'info' },
  { id: 4, action: 'User access revoked', target: 'Priya Patel', actor: 'Super Admin', time: '2026-03-27T18:45:00', type: 'error' },
  { id: 5, action: 'System health check', target: 'All Systems', actor: 'Cron Job', time: '2026-03-27T18:00:00', type: 'success' },
  { id: 6, action: 'Billing invoice generated', target: 'BITS Pilani', actor: 'System', time: '2026-03-27T17:30:00', type: 'info' },
];

export const mockAlerts = [
  { id: 1, severity: 'error', message: '3 colleges have expired plans', time: '10 min ago' },
  { id: 2, severity: 'warning', message: 'Server CPU at 87% — consider scaling', time: '25 min ago' },
  { id: 3, severity: 'info', message: '5 new user registrations pending approval', time: '1 hour ago' },
  { id: 4, severity: 'success', message: 'Backup completed successfully', time: '2 hours ago' },
];

export const mockColleges = [
  { id: 1, name: 'IIT Delhi', code: 'IITD', city: 'New Delhi', state: 'Delhi', status: 'active', plan: 'Enterprise', buses: 24, controllers: 5, users: 480, createdAt: '2024-06-15' },
  { id: 2, name: 'NIT Warangal', code: 'NITW', city: 'Warangal', state: 'Telangana', status: 'active', plan: 'Professional', buses: 18, controllers: 4, users: 350, createdAt: '2024-08-20' },
  { id: 3, name: 'BITS Pilani', code: 'BITS', city: 'Pilani', state: 'Rajasthan', status: 'active', plan: 'Enterprise', buses: 22, controllers: 5, users: 420, createdAt: '2024-05-10' },
  { id: 4, name: 'VIT Vellore', code: 'VIT', city: 'Vellore', state: 'Tamil Nadu', status: 'inactive', plan: 'Basic', buses: 12, controllers: 3, users: 250, createdAt: '2024-09-01' },
  { id: 5, name: 'SRM Chennai', code: 'SRM', city: 'Chennai', state: 'Tamil Nadu', status: 'active', plan: 'Professional', buses: 20, controllers: 4, users: 380, createdAt: '2024-07-22' },
  { id: 6, name: 'Amity Noida', code: 'AMT', city: 'Noida', state: 'Uttar Pradesh', status: 'suspended', plan: 'Basic', buses: 8, controllers: 2, users: 180, createdAt: '2024-10-05' },
  { id: 7, name: 'LPU Jalandhar', code: 'LPU', city: 'Jalandhar', state: 'Punjab', status: 'active', plan: 'Professional', buses: 30, controllers: 6, users: 620, createdAt: '2024-04-18' },
  { id: 8, name: 'Manipal University', code: 'MU', city: 'Manipal', state: 'Karnataka', status: 'active', plan: 'Enterprise', buses: 26, controllers: 5, users: 510, createdAt: '2024-03-12' },
  { id: 9, name: 'Christ University', code: 'CU', city: 'Bangalore', state: 'Karnataka', status: 'active', plan: 'Professional', buses: 14, controllers: 3, users: 290, createdAt: '2024-11-01' },
  { id: 10, name: 'Jadavpur University', code: 'JU', city: 'Kolkata', state: 'West Bengal', status: 'inactive', plan: 'Basic', buses: 10, controllers: 2, users: 200, createdAt: '2025-01-15' },
];

export const mockAdmins = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@iitd.ac.in', role: 'admin', college: 'IIT Delhi', status: 'active', lastLogin: '2026-03-27T15:30:00', createdAt: '2024-06-15', permissions: ['manage_buses', 'manage_users', 'view_reports'] },
  { id: 2, name: 'Priya Sharma', email: 'priya@nitw.ac.in', role: 'controller', college: 'NIT Warangal', status: 'active', lastLogin: '2026-03-27T14:00:00', createdAt: '2024-08-20', permissions: ['manage_buses', 'view_reports'] },
  { id: 3, name: 'Amit Singh', email: 'amit@bits.ac.in', role: 'admin', college: 'BITS Pilani', status: 'suspended', lastLogin: '2026-03-20T10:00:00', createdAt: '2024-05-10', permissions: ['manage_buses', 'manage_users', 'view_reports', 'manage_billing'] },
  { id: 4, name: 'Sanya Gupta', email: 'sanya@vit.ac.in', role: 'controller', college: 'VIT Vellore', status: 'inactive', lastLogin: '2026-03-15T09:00:00', createdAt: '2024-09-01', permissions: ['manage_buses'] },
  { id: 5, name: 'Vikram Patel', email: 'vikram@srm.ac.in', role: 'admin', college: 'SRM Chennai', status: 'active', lastLogin: '2026-03-27T16:45:00', createdAt: '2024-07-22', permissions: ['manage_buses', 'manage_users', 'view_reports'] },
  { id: 6, name: 'Neha Reddy', email: 'neha@amity.edu', role: 'admin', college: 'Amity Noida', status: 'revoked', lastLogin: '2026-02-28T12:00:00', createdAt: '2024-10-05', permissions: [] },
  { id: 7, name: 'Karan Mehta', email: 'karan@lpu.in', role: 'controller', college: 'LPU Jalandhar', status: 'active', lastLogin: '2026-03-27T11:30:00', createdAt: '2024-04-18', permissions: ['manage_buses', 'view_reports'] },
  { id: 8, name: 'Divya Nair', email: 'divya@manipal.edu', role: 'admin', college: 'Manipal University', status: 'active', lastLogin: '2026-03-27T13:00:00', createdAt: '2024-03-12', permissions: ['manage_buses', 'manage_users', 'view_reports', 'manage_billing'] },
];

export const mockUsers = [
  { id: 1, name: 'Arjun Verma', email: 'arjun@iitd.ac.in', role: 'student', college: 'IIT Delhi', status: 'active', lastActive: '2026-03-27T18:00:00' },
  { id: 2, name: 'Meera Iyer', email: 'meera@nitw.ac.in', role: 'faculty', college: 'NIT Warangal', status: 'active', lastActive: '2026-03-27T17:30:00' },
  { id: 3, name: 'Rohan Das', email: 'rohan@bits.ac.in', role: 'student', college: 'BITS Pilani', status: 'inactive', lastActive: '2026-03-20T10:00:00' },
  { id: 4, name: 'Ananya Joshi', email: 'ananya@vit.ac.in', role: 'student', college: 'VIT Vellore', status: 'active', lastActive: '2026-03-27T16:45:00' },
  { id: 5, name: 'Siddharth Rao', email: 'sid@srm.ac.in', role: 'driver', college: 'SRM Chennai', status: 'active', lastActive: '2026-03-27T15:00:00' },
  { id: 6, name: 'Kavitha M.', email: 'kavitha@amity.edu', role: 'faculty', college: 'Amity Noida', status: 'suspended', lastActive: '2026-03-15T08:00:00' },
  { id: 7, name: 'Rahul Tiwari', email: 'rahul@lpu.in', role: 'student', college: 'LPU Jalandhar', status: 'active', lastActive: '2026-03-27T14:30:00' },
  { id: 8, name: 'Pooja Krishnan', email: 'pooja@manipal.edu', role: 'staff', college: 'Manipal University', status: 'active', lastActive: '2026-03-27T13:15:00' },
];

export const mockPlans = [
  { id: 1, name: 'Basic', price: 9999, duration: 30, maxBuses: 15, maxUsers: 300, maxControllers: 3, features: ['GPS Tracking', 'Basic Reports', 'Email Support'], status: 'active' },
  { id: 2, name: 'Professional', price: 24999, duration: 30, maxBuses: 50, maxUsers: 1000, maxControllers: 8, features: ['GPS Tracking', 'Advanced Reports', 'Priority Support', 'Custom Alerts'], status: 'active' },
  { id: 3, name: 'Enterprise', price: 49999, duration: 30, maxBuses: 200, maxUsers: 5000, maxControllers: 20, features: ['GPS Tracking', 'Advanced Reports', '24/7 Support', 'Custom Alerts', 'API Access', 'White-label'], status: 'active' },
];

export const mockInvoices = [
  { id: 'INV-2026-001', college: 'IIT Delhi', plan: 'Enterprise', amount: 49999, status: 'active', issuedDate: '2026-03-01', dueDate: '2026-03-31', paidDate: '2026-03-05' },
  { id: 'INV-2026-002', college: 'NIT Warangal', plan: 'Professional', amount: 24999, status: 'active', issuedDate: '2026-03-01', dueDate: '2026-03-31', paidDate: '2026-03-03' },
  { id: 'INV-2026-003', college: 'BITS Pilani', plan: 'Enterprise', amount: 49999, status: 'pending', issuedDate: '2026-03-01', dueDate: '2026-03-31', paidDate: null },
  { id: 'INV-2026-004', college: 'VIT Vellore', plan: 'Basic', amount: 9999, status: 'expired', issuedDate: '2026-02-01', dueDate: '2026-02-28', paidDate: null },
  { id: 'INV-2026-005', college: 'SRM Chennai', plan: 'Professional', amount: 24999, status: 'active', issuedDate: '2026-03-01', dueDate: '2026-03-31', paidDate: '2026-03-07' },
  { id: 'INV-2026-006', college: 'LPU Jalandhar', plan: 'Professional', amount: 24999, status: 'pending', issuedDate: '2026-03-01', dueDate: '2026-03-31', paidDate: null },
];

export const mockAuditLogs = [
  { id: 1, action: 'Admin Created', actor: 'Super Admin', target: 'Rajesh Kumar', details: 'Created admin for IIT Delhi', timestamp: '2026-03-27T22:30:00', category: 'admin' },
  { id: 2, action: 'Admin Deactivated', actor: 'Super Admin', target: 'Sanya Gupta', details: 'Temporarily suspended access', timestamp: '2026-03-27T21:15:00', category: 'admin' },
  { id: 3, action: 'Access Revoked', actor: 'Super Admin', target: 'Neha Reddy', details: 'Immediate token invalidation', timestamp: '2026-03-27T20:00:00', category: 'security' },
  { id: 4, action: 'Plan Assigned', actor: 'Super Admin', target: 'NIT Warangal', details: 'Assigned Professional plan', timestamp: '2026-03-27T18:45:00', category: 'billing' },
  { id: 5, action: 'College Added', actor: 'Super Admin', target: 'Christ University', details: 'New college registration', timestamp: '2026-03-27T17:30:00', category: 'college' },
  { id: 6, action: 'Settings Updated', actor: 'Super Admin', target: 'System', details: 'Tracking interval changed to 15s', timestamp: '2026-03-27T16:00:00', category: 'settings' },
  { id: 7, action: 'Admin Deleted', actor: 'Super Admin', target: 'Old Account', details: 'Permanent deletion of inactive admin', timestamp: '2026-03-27T14:30:00', category: 'admin' },
  { id: 8, action: 'Invoice Generated', actor: 'System', target: 'BITS Pilani', details: 'Monthly invoice INV-2026-003', timestamp: '2026-03-27T12:00:00', category: 'billing' },
  { id: 9, action: 'Feature Toggle', actor: 'Super Admin', target: 'Live Tracking', details: 'Enabled for all colleges', timestamp: '2026-03-26T22:00:00', category: 'settings' },
  { id: 10, action: 'Admin Activated', actor: 'Super Admin', target: 'Vikram Patel', details: 'Reactivated after review', timestamp: '2026-03-26T20:00:00', category: 'admin' },
];

export const mockSettings = {
  trackingInterval: 15,
  notificationRules: {
    emailOnNewRegistration: true,
    emailOnPlanExpiry: true,
    emailOnSecurityAlert: true,
    smsOnCriticalAlert: false,
  },
  featureToggles: {
    liveTracking: true,
    advancedAnalytics: true,
    parentNotifications: true,
    driverChat: false,
    multiLanguage: false,
    darkMode: true,
  },
};
