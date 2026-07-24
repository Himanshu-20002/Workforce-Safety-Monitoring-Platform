/**
 * Application constants
 */

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SUPERVISORS: '/admin/supervisors',
    ALERTS: '/admin/alerts',
    ANALYTICS: '/admin/analytics',
  },
  SUPERVISOR: {
    DASHBOARD: '/supervisor/dashboard',
    VIOLATIONS: '/supervisor/violations',
    REPORTS: '/supervisor/reports',
  },
};

export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  ALERTS: '/api/alerts',
  REPORTS: '/api/reports',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};
