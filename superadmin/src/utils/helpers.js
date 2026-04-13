import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

// Format date to readable string
export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : '—';
};

// Format date with time
export const formatDateTime = (date) => formatDate(date, 'MMM dd, yyyy HH:mm');

// Relative time (e.g., "2 hours ago")
export const timeAgo = (date) => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—';
};

// Format number with commas
export const formatNumber = (num) => {
  if (num == null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Truncate text
export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? `${str.substring(0, len)}...` : str;
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate a random color based on string
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

// Download file
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
