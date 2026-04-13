// Sidebar navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard' },
  { label: 'Colleges', path: '/colleges', icon: 'School' },
  { label: 'Controllers/Admins', path: '/controllers', icon: 'AdminPanelSettings' },
  { label: 'Users', path: '/users', icon: 'People' },
  { label: 'Billing', path: '/billing', icon: 'Receipt' },
  { label: 'Reports', path: '/reports', icon: 'Assessment' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Logs', path: '/logs', icon: 'History' },
];

// User roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CONTROLLER: 'controller',
  USER: 'user',
};

// Status options
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
  PENDING: 'pending',
  EXPIRED: 'expired',
};

// Status colors
export const STATUS_COLORS = {
  active: 'success',
  inactive: 'default',
  suspended: 'warning',
  revoked: 'error',
  pending: 'info',
  expired: 'error',
};

// Billing plan durations
export const PLAN_DURATIONS = [
  { value: 30, label: '1 Month' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' },
];

// Sidebar width
export const SIDEBAR_WIDTH = 270;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const TOPBAR_HEIGHT = 64;
