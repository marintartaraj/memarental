/**
 * Users Store
 * Global state management for users functionality using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/lib/customSupabaseClient';

const useUsersStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        users: [],
        loading: false,
        refreshing: false,
        error: null,
        currentPage: 1,
        itemsPerPage: 20,
        totalPages: 0,
        totalCount: 0,
        
        // Filters and search
        searchTerm: '',
        debouncedSearchTerm: '',
        filters: {
          status: 'all',
          dateFilter: 'all'
        },
        
        // Sorting
        sortBy: 'created_at',
        sortOrder: 'desc',
        
        // Form state
        editingUser: null,
        isUserDialogOpen: false,
        isSubmitting: false,
        userFormData: {
          full_name: '',
          email: '',
          phone: ''
        },
        
        // Selected users for bulk operations
        selectedUsers: new Set(),
        selectAll: false,

        // Stats
        userStats: {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        },

        // Actions
        setUsers: (users) => set({ users }),
        setLoading: (loading) => set({ loading }),
        setRefreshing: (refreshing) => set({ refreshing }),
        setError: (error) => set({ error }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setTotalPages: (totalPages) => set({ totalPages }),
        setTotalCount: (totalCount) => set({ totalCount }),
        
        // Search and filters
        setSearchTerm: (searchTerm) => set({ searchTerm }),
        setDebouncedSearchTerm: (debouncedSearchTerm) => set({ debouncedSearchTerm }),
        setFilters: (filters) => set({ filters }),
        updateFilter: (filterType, value) => set((state) => ({
          filters: { ...state.filters, [filterType]: value }
        })),
        
        // Sorting
        setSortBy: (sortBy) => set({ sortBy }),
        setSortOrder: (sortOrder) => set({ sortOrder }),
        
        // Form state
        setEditingUser: (user) => set({ editingUser: user }),
        setIsUserDialogOpen: (isOpen) => set({ isUserDialogOpen: isOpen }),
        setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
        setUserFormData: (formData) => set({ userFormData: formData }),
        updateUserFormData: (updates) => set((state) => ({
          userFormData: { ...state.userFormData, ...updates }
        })),
        
        // Selection
        setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
        setSelectAll: (selectAll) => set({ selectAll }),
        toggleUserSelection: (userId) => set((state) => {
          const newSelected = new Set(state.selectedUsers);
          if (newSelected.has(userId)) {
            newSelected.delete(userId);
          } else {
            newSelected.add(userId);
          }
          return { selectedUsers: newSelected };
        }),
        toggleSelectAll: () => set((state) => {
          const currentPageUsers = state.users.slice(
            (state.currentPage - 1) * state.itemsPerPage,
            state.currentPage * state.itemsPerPage
          );
          
          if (state.selectedUsers.size === currentPageUsers.length) {
            return { selectedUsers: new Set(), selectAll: false };
          } else {
            return { 
              selectedUsers: new Set(currentPageUsers.map(user => user.id)),
              selectAll: true 
            };
          }
        }),

        // Stats
        setUserStats: (stats) => set({ userStats: stats }),

        // Complex actions
        loadUsers: async (page = 1, showRefreshing = false) => {
          const state = get();
          
          if (showRefreshing) {
            set({ refreshing: true });
          } else {
            set({ loading: true });
          }
          set({ error: null });

          try {
            console.log('🚀 Loading users with Zustand store...');
            
            // Build query
            let query = supabase.from('profiles').select('*');

            // Apply date filters
            if (state.filters.dateFilter && state.filters.dateFilter !== 'all') {
              const now = new Date();
              let startDate, endDate;

              switch (state.filters.dateFilter) {
                case 'today':
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                  break;
                case 'week':
                  startDate = now;
                  endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  break;
                case 'month':
                  startDate = now;
                  endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                  break;
                case 'past':
                  endDate = now;
                  break;
                default:
                  break;
              }

              if (startDate) {
                query = query.gte('created_at', startDate.toISOString());
              }
              if (endDate) {
                query = query.lte('created_at', endDate.toISOString());
              }
            }

            // Apply sorting
            query = query.order(state.sortBy, { ascending: state.sortOrder === 'asc' });

            // Apply pagination
            const from = (page - 1) * state.itemsPerPage;
            const to = from + state.itemsPerPage - 1;
            query = query.range(from, to);

            const { data, error } = await query;

            if (error) throw error;

            // Client-side search filtering
            let filteredData = data || [];
            if (state.debouncedSearchTerm) {
              filteredData = filteredData.filter(user => 
                (user.full_name && user.full_name.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase()))
              );
            }

            // Get total count for pagination
            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true });

            // Calculate stats
            const totalUsers = count || 0;
            const userStats = {
              totalUsers,
              activeUsers: totalUsers, // All users are considered active since is_active column doesn't exist
              inactiveUsers: 0
            };

            set({
              users: filteredData,
              totalCount: count || 0,
              totalPages: Math.ceil((count || 0) / state.itemsPerPage),
              currentPage: page,
              userStats
            });

            console.log(`✅ Loaded ${filteredData.length} users (page ${page})`);

          } catch (error) {
            console.error('❌ Error loading users:', error);
            set({ error: error.message });
          } finally {
            set({ loading: false, refreshing: false });
          }
        },

        createUser: async (userData) => {
          set({ isSubmitting: true });
          try {
            const { data, error } = await supabase
              .from('profiles')
              .insert([userData])
              .select()
              .single();

            if (error) throw error;

            // Reload users
            await get().loadUsers(get().currentPage);
            
            return data;
          } catch (error) {
            console.error('Error creating user:', error);
            set({ error: error.message });
            throw error;
          } finally {
            set({ isSubmitting: false });
          }
        },

        updateUser: async (userId, updates) => {
          set({ isSubmitting: true });
          try {
            const { data, error } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', userId)
              .select()
              .single();

            if (error) throw error;

            // Reload users
            await get().loadUsers(get().currentPage);
            
            return data;
          } catch (error) {
            console.error('Error updating user:', error);
            set({ error: error.message });
            throw error;
          } finally {
            set({ isSubmitting: false });
          }
        },

        deleteUser: async (userId) => {
          try {
            const { error } = await supabase
              .from('profiles')
              .delete()
              .eq('id', userId);

            if (error) throw error;

            // Remove from selected users if it was selected
            set((state) => {
              const newSelected = new Set(state.selectedUsers);
              newSelected.delete(userId);
              return { selectedUsers: newSelected };
            });

            // Reload users
            await get().loadUsers(get().currentPage);
          } catch (error) {
            console.error('Error deleting user:', error);
            set({ error: error.message });
            throw error;
          }
        },

        bulkDeleteUsers: async (userIds) => {
          try {
            const { error } = await supabase
              .from('profiles')
              .delete()
              .in('id', Array.from(userIds));

            if (error) throw error;

            // Clear selection
            set({ selectedUsers: new Set(), selectAll: false });

            // Reload users
            await get().loadUsers(get().currentPage);
          } catch (error) {
            console.error('Error bulk deleting users:', error);
            set({ error: error.message });
            throw error;
          }
        },

        handleEditUser: (user) => {
          set({
            editingUser: user,
            userFormData: {
              full_name: user.full_name || '',
              email: user.email || '',
              phone: user.phone || ''
            },
            isUserDialogOpen: true
          });
        },

        resetUserForm: () => {
          set({
            editingUser: null,
            userFormData: {
              full_name: '',
              email: '',
              phone: ''
            }
          });
        },

        handleSort: (field) => {
          const state = get();
          if (state.sortBy === field) {
            set({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' });
          } else {
            set({ sortBy: field, sortOrder: 'asc' });
          }
          get().loadUsers(1);
        },

        handleSearch: (searchTerm) => {
          set({ searchTerm, currentPage: 1 });
          // Debounce search
          setTimeout(() => {
            set({ debouncedSearchTerm: searchTerm });
            get().loadUsers(1);
          }, 300);
        },

        handleFilterChange: (filterType, value) => {
          set((state) => ({
            filters: { ...state.filters, [filterType]: value },
            currentPage: 1
          }));
          get().loadUsers(1);
        },

        exportUsers: async () => {
          try {
            const state = get();
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .order(state.sortBy, { ascending: state.sortOrder === 'asc' });

            if (error) throw error;

            // Filter data
            let filteredData = data || [];
            if (state.debouncedSearchTerm) {
              filteredData = filteredData.filter(user => 
                (user.full_name && user.full_name.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase()))
              );
            }

            // Convert to CSV
            const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Status', 'Created At', 'Updated At'];
            const csvContent = [
              headers.join(','),
              ...filteredData.map(user => [
                user.id,
                `"${user.full_name || 'Unknown'}"`,
                `"${user.email || 'No email'}"`,
                `"${user.phone || 'No phone'}"`,
                'Active', // All users are considered active
                user.created_at,
                user.updated_at
              ].join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            return csvContent;
          } catch (error) {
            console.error('Error exporting users:', error);
            set({ error: error.message });
            throw error;
          }
        },

        // Reset all filters
        resetFilters: () => {
          set({
            searchTerm: '',
            debouncedSearchTerm: '',
            filters: {
              status: 'all',
              dateFilter: 'all'
            },
            sortBy: 'created_at',
            sortOrder: 'desc',
            currentPage: 1,
            selectedUsers: new Set(),
            selectAll: false
          });
        },

        // Clear all data
        clearData: () => {
          set({
            users: [],
            error: null,
            selectedUsers: new Set(),
            selectAll: false,
            editingUser: null,
            isUserDialogOpen: false,
            userFormData: {
              full_name: '',
              email: '',
              phone: ''
            },
            userStats: {
              totalUsers: 0,
              activeUsers: 0,
              inactiveUsers: 0
            }
          });
        }
      }),
      {
        name: 'users-store',
        partialize: (state) => ({
          // Only persist certain state
          itemsPerPage: state.itemsPerPage,
          searchTerm: state.searchTerm,
          filters: state.filters,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      }
    ),
    {
      name: 'users-store'
    }
  )
);

export default useUsersStore;

