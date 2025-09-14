/**
 * Store Index
 * Centralized export for all Zustand stores
 */

// Import all stores
import useAdminStore from './adminStore.js';
import useCarsStore from './carsStore.js';
import useUsersStore from './usersStore.js';
import useAppStore from './appStore.js';
import useSecurityStore from './securityStore.js';

// Export all stores
export {
  useAdminStore,
  useCarsStore,
  useUsersStore,
  useAppStore,
  useSecurityStore
};

// Export default (admin store for backward compatibility)
export default useAdminStore;
