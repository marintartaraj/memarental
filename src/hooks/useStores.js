/**
 * Combined Stores Hook
 * Provides access to all stores in a single hook
 */

import { useAdminStore } from '@/stores/adminStore.js';
import { useCarsStore } from '@/stores/carsStore.js';
import { useUsersStore } from '@/stores/usersStore.js';
import { useAppStore } from '@/stores/appStore.js';
import { useSecurityStore } from '@/stores/securityStore.js';

export const useStores = () => {
  const adminStore = useAdminStore();
  const carsStore = useCarsStore();
  const usersStore = useUsersStore();
  const appStore = useAppStore();
  const securityStore = useSecurityStore();

  return {
    admin: adminStore,
    cars: carsStore,
    users: usersStore,
    app: appStore,
    security: securityStore
  };
};

// Individual store hooks for convenience
export const useAdmin = () => useAdminStore();
export const useCars = () => useCarsStore();
export const useUsers = () => useUsersStore();
export const useApp = () => useAppStore();
export const useSecurity = () => useSecurityStore();

export default useStores;
