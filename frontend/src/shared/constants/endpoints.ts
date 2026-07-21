export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SITES: {
    BASE: '/sites',
    BY_ID: (id: string) => `/sites/${id}`,
  },
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id: string) => `/departments/${id}`,
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: string) => `/employees/${id}`,
    BULK_IMPORT: '/employees/bulk-import',
  },
  SUPERVISORS: {
    BASE: '/supervisors',
    BY_ID: (id: string) => `/supervisors/${id}`,
  },
  VIOLATION_TYPES: {
    BASE: '/violation-types',
    OPTIONS: '/violation-types/options',
    BY_ID: (id: string) => `/violation-types/${id}`,
  },
  SETTINGS: {
    BASE: '/settings',
  }
};
