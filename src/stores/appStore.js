/**
 * App Store
 * Global application state management using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        sidebarOpen: true,
        mobileMenuOpen: false,
        theme: 'light',
        
        // Loading states
        globalLoading: false,
        loadingStates: {},
        
        // Error states
        globalError: null,
        errors: {},
        
        // Notifications
        notifications: [],
        
        // Performance metrics
        performanceMetrics: {
          pageLoadTime: 0,
          apiResponseTime: 0,
          cacheHitRate: 0,
          memoryUsage: 0
        },
        
        // User preferences
        preferences: {
          itemsPerPage: 20,
          defaultSort: 'created_at',
          defaultSortOrder: 'desc',
          autoRefresh: true,
          refreshInterval: 30000, // 30 seconds
          showNotifications: true,
          compactMode: false
        },

        // Actions - UI State
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
        toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),

        // Actions - Loading States
        setGlobalLoading: (loading) => set({ globalLoading: loading }),
        setLoadingState: (key, loading) => set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading }
        })),
        clearLoadingState: (key) => set((state) => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[key];
          return { loadingStates: newLoadingStates };
        }),
        clearAllLoadingStates: () => set({ 
          loadingStates: {},
          globalLoading: false
        }),

        // Actions - Error States
        setGlobalError: (error) => set({ globalError: error }),
        setError: (key, error) => set((state) => ({
          errors: { ...state.errors, [key]: error }
        })),
        clearError: (key) => set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[key];
          return { errors: newErrors };
        }),
        clearAllErrors: () => set({ 
          errors: {},
          globalError: null
        }),

        // Actions - Notifications
        addNotification: (notification) => set((state) => ({
          notifications: [...state.notifications, {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...notification
          }]
        })),
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        clearNotifications: () => set({ notifications: [] }),
        
        // Helper for toast notifications
        showNotification: (type, title, message, duration = 5000) => {
          const notification = {
            type,
            title,
            message,
            duration,
            autoClose: true
          };
          get().addNotification(notification);
          
          if (notification.autoClose) {
            setTimeout(() => {
              get().removeNotification(notification.id);
            }, duration);
          }
        },

        // Actions - Performance Metrics
        setPerformanceMetrics: (metrics) => set({ performanceMetrics: metrics }),
        updatePerformanceMetric: (key, value) => set((state) => ({
          performanceMetrics: { ...state.performanceMetrics, [key]: value }
        })),
        resetPerformanceMetrics: () => set({
          performanceMetrics: {
            pageLoadTime: 0,
            apiResponseTime: 0,
            cacheHitRate: 0,
            memoryUsage: 0
          }
        }),

        // Actions - User Preferences
        setPreferences: (preferences) => set({ preferences }),
        updatePreference: (key, value) => set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        })),
        resetPreferences: () => set({
          preferences: {
            itemsPerPage: 20,
            defaultSort: 'created_at',
            defaultSortOrder: 'desc',
            autoRefresh: true,
            refreshInterval: 30000,
            showNotifications: true,
            compactMode: false
          }
        }),

        // Complex Actions
        initializeApp: async () => {
          set({ globalLoading: true });
          try {
            // Initialize app state
            
            // Set initial loading states
            set({
              loadingStates: {
                auth: true,
                user: true,
                preferences: true
              }
            });

            // Simulate initialization
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear loading states
            set({
              globalLoading: false,
              loadingStates: {}
            });

          } catch (error) {
            console.error('❌ Error initializing app:', error);
            set({
              globalLoading: false,
              globalError: error.message
            });
          }
        },

        // Utility actions
        resetApp: () => set({
          sidebarOpen: true,
          mobileMenuOpen: false,
          globalLoading: false,
          loadingStates: {},
          globalError: null,
          errors: {},
          notifications: [],
          performanceMetrics: {
            pageLoadTime: 0,
            apiResponseTime: 0,
            cacheHitRate: 0,
            memoryUsage: 0
          }
        }),

        // Get computed values
        getIsLoading: (key) => {
          const state = get();
          return key ? state.loadingStates[key] || false : state.globalLoading;
        },

        getError: (key) => {
          const state = get();
          return key ? state.errors[key] || null : state.globalError;
        },

        getNotificationCount: () => {
          const state = get();
          return state.notifications.length;
        },

        // Debug helpers
        logState: () => {
        },

        exportState: () => {
          const state = get();
          const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `app-state-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          // Only persist certain state
          theme: state.theme,
          preferences: state.preferences,
          sidebarOpen: state.sidebarOpen
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
);

export default useAppStore;

