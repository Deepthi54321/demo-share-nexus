
// Re-export all API functions and types for backwards compatibility
export * from '../types/api';
export { sessionApi } from './sessionApi';
export { userApi } from './userApi';
export { settingsApi } from './settingsApi';
export { teamSettingsApi } from './teamSettingsApi';
export { notificationSettingsApi } from './notificationSettingsApi';
export { BASE_URL } from './apiConfig';
