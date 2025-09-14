/**
 * Cars Store
 * Global state management for cars functionality using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/lib/customSupabaseClient';

const useCarsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        cars: [],
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
          fuelType: 'all',
          transmission: 'all',
          seats: 'all',
          priceRange: { min: '', max: '' },
          yearRange: { min: '', max: '' }
        },
        
        // Sorting
        sortBy: 'created_at',
        sortOrder: 'desc',
        
        // Form state
        editingCar: null,
        isCarDialogOpen: false,
        isSubmitting: false,
        carFormData: {
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          daily_rate: '',
          transmission: 'automatic',
          seats: 5,
          luggage: 2,
          fuel_type: 'petrol',
          status: 'available',
          engine: '',
          image_url: ''
        },
        
        // Filter options
        filterOptions: {
          status: [],
          fuelType: [],
          transmission: []
        },
        
        // Selected cars for bulk operations
        selectedCars: new Set(),
        selectAll: false,

        // Actions
        setCars: (cars) => set({ cars }),
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
        setEditingCar: (car) => set({ editingCar: car }),
        setIsCarDialogOpen: (isOpen) => set({ isCarDialogOpen: isOpen }),
        setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
        setCarFormData: (formData) => set({ carFormData: formData }),
        updateCarFormData: (updates) => set((state) => ({
          carFormData: { ...state.carFormData, ...updates }
        })),
        
        // Filter options
        setFilterOptions: (options) => set({ filterOptions: options }),
        
        // Selection
        setSelectedCars: (selectedCars) => set({ selectedCars }),
        setSelectAll: (selectAll) => set({ selectAll }),
        toggleCarSelection: (carId) => set((state) => {
          const newSelected = new Set(state.selectedCars);
          if (newSelected.has(carId)) {
            newSelected.delete(carId);
          } else {
            newSelected.add(carId);
          }
          return { selectedCars: newSelected };
        }),
        toggleSelectAll: () => set((state) => {
          const currentPageCars = state.cars.slice(
            (state.currentPage - 1) * state.itemsPerPage,
            state.currentPage * state.itemsPerPage
          );
          
          if (state.selectedCars.size === currentPageCars.length) {
            return { selectedCars: new Set(), selectAll: false };
          } else {
            return { 
              selectedCars: new Set(currentPageCars.map(car => car.id)),
              selectAll: true 
            };
          }
        }),

        // Complex actions
        loadFilterOptions: async () => {
          try {
            const [statusResult, fuelResult, transmissionResult] = await Promise.all([
              supabase.from('cars').select('status').not('status', 'is', null),
              supabase.from('cars').select('fuel_type').not('fuel_type', 'is', null),
              supabase.from('cars').select('transmission').not('transmission', 'is', null)
            ]);

            const statusOptions = [...new Set(statusResult.data.map(item => item.status))]
              .filter(value => value).sort()
              .map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

            const fuelOptions = [...new Set(fuelResult.data.map(item => item.fuel_type))]
              .filter(value => value).sort()
              .map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

            const transmissionOptions = [...new Set(transmissionResult.data.map(item => item.transmission))]
              .filter(value => value).sort()
              .map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

            set({ filterOptions: { status: statusOptions, fuelType: fuelOptions, transmission: transmissionOptions } });
          } catch (error) {
            console.error('Error loading filter options:', error);
          }
        },

        loadCars: async (page = 1, showRefreshing = false) => {
          const state = get();
          
          if (showRefreshing) {
            set({ refreshing: true });
          } else {
            set({ loading: true });
          }
          set({ error: null });

          try {
            console.log('🚀 Loading cars with Zustand store...');
            
            // Build query
            let query = supabase.from('cars').select('*');

            // Apply status filter
            if (state.filters.status && state.filters.status !== 'all') {
              query = query.eq('status', state.filters.status);
            }

            // Apply fuel type filter
            if (state.filters.fuelType && state.filters.fuelType !== 'all') {
              query = query.eq('fuel_type', state.filters.fuelType);
            }

            // Apply transmission filter
            if (state.filters.transmission && state.filters.transmission !== 'all') {
              query = query.eq('transmission', state.filters.transmission);
            }

            // Apply price range filters
            if (state.filters.priceRange.min) {
              query = query.gte('daily_rate', parseFloat(state.filters.priceRange.min));
            }
            if (state.filters.priceRange.max) {
              query = query.lte('daily_rate', parseFloat(state.filters.priceRange.max));
            }

            // Apply year range filters
            if (state.filters.yearRange.min) {
              query = query.gte('year', parseInt(state.filters.yearRange.min));
            }
            if (state.filters.yearRange.max) {
              query = query.lte('year', parseInt(state.filters.yearRange.max));
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
              filteredData = filteredData.filter(car => 
                car.brand.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(state.debouncedSearchTerm.toLowerCase())
              );
            }

            // Get total count for pagination
            const { count } = await supabase
              .from('cars')
              .select('*', { count: 'exact', head: true });

            set({
              cars: filteredData,
              totalCount: count || 0,
              totalPages: Math.ceil((count || 0) / state.itemsPerPage),
              currentPage: page
            });

            console.log(`✅ Loaded ${filteredData.length} cars (page ${page})`);

          } catch (error) {
            console.error('❌ Error loading cars:', error);
            set({ error: error.message });
          } finally {
            set({ loading: false, refreshing: false });
          }
        },

        createCar: async (carData) => {
          set({ isSubmitting: true });
          try {
            const { data, error } = await supabase
              .from('cars')
              .insert([carData])
              .select()
              .single();

            if (error) throw error;

            // Reload cars
            await get().loadCars(get().currentPage);
            
            return data;
          } catch (error) {
            console.error('Error creating car:', error);
            set({ error: error.message });
            throw error;
          } finally {
            set({ isSubmitting: false });
          }
        },

        updateCar: async (carId, updates) => {
          set({ isSubmitting: true });
          try {
            const { data, error } = await supabase
              .from('cars')
              .update(updates)
              .eq('id', carId)
              .select()
              .single();

            if (error) throw error;

            // Reload cars
            await get().loadCars(get().currentPage);
            
            return data;
          } catch (error) {
            console.error('Error updating car:', error);
            set({ error: error.message });
            throw error;
          } finally {
            set({ isSubmitting: false });
          }
        },

        deleteCar: async (carId) => {
          try {
            const { error } = await supabase
              .from('cars')
              .delete()
              .eq('id', carId);

            if (error) throw error;

            // Remove from selected cars if it was selected
            set((state) => {
              const newSelected = new Set(state.selectedCars);
              newSelected.delete(carId);
              return { selectedCars: newSelected };
            });

            // Reload cars
            await get().loadCars(get().currentPage);
          } catch (error) {
            console.error('Error deleting car:', error);
            set({ error: error.message });
            throw error;
          }
        },

        bulkUpdateStatus: async (carIds, status) => {
          try {
            const { error } = await supabase
              .from('cars')
              .update({ status })
              .in('id', Array.from(carIds));

            if (error) throw error;

            // Clear selection
            set({ selectedCars: new Set(), selectAll: false });

            // Reload cars
            await get().loadCars(get().currentPage);
          } catch (error) {
            console.error('Error bulk updating cars:', error);
            set({ error: error.message });
            throw error;
          }
        },

        handleEditCar: (car) => {
          set({
            editingCar: car,
            carFormData: {
              brand: car.brand || '',
              model: car.model || '',
              year: car.year || new Date().getFullYear(),
              daily_rate: car.daily_rate || '',
              transmission: car.transmission || 'automatic',
              seats: car.seats || 5,
              luggage: car.luggage || 2,
              fuel_type: car.fuel_type || 'petrol',
              status: car.status || 'available',
              engine: car.engine || '',
              image_url: car.image_url || ''
            },
            isCarDialogOpen: true
          });
        },

        resetCarForm: () => {
          set({
            editingCar: null,
            carFormData: {
              brand: '',
              model: '',
              year: new Date().getFullYear(),
              daily_rate: '',
              transmission: 'automatic',
              seats: 5,
              luggage: 2,
              fuel_type: 'petrol',
              status: 'available',
              engine: '',
              image_url: ''
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
          get().loadCars(1);
        },

        handleSearch: (searchTerm) => {
          set({ searchTerm, currentPage: 1 });
          // Debounce search
          setTimeout(() => {
            set({ debouncedSearchTerm: searchTerm });
            get().loadCars(1);
          }, 300);
        },

        handleFilterChange: (filterType, value) => {
          set((state) => ({
            filters: { ...state.filters, [filterType]: value },
            currentPage: 1
          }));
          get().loadCars(1);
        },

        // Reset all filters
        resetFilters: () => {
          set({
            searchTerm: '',
            debouncedSearchTerm: '',
            filters: {
              status: 'all',
              fuelType: 'all',
              transmission: 'all',
              seats: 'all',
              priceRange: { min: '', max: '' },
              yearRange: { min: '', max: '' }
            },
            sortBy: 'created_at',
            sortOrder: 'desc',
            currentPage: 1,
            selectedCars: new Set(),
            selectAll: false
          });
        },

        // Clear all data
        clearData: () => {
          set({
            cars: [],
            error: null,
            selectedCars: new Set(),
            selectAll: false,
            editingCar: null,
            isCarDialogOpen: false,
            carFormData: {
              brand: '',
              model: '',
              year: new Date().getFullYear(),
              daily_rate: '',
              transmission: 'automatic',
              seats: 5,
              luggage: 2,
              fuel_type: 'petrol',
              status: 'available',
              engine: '',
              image_url: ''
            }
          });
        }
      }),
      {
        name: 'cars-store',
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
      name: 'cars-store'
    }
  )
);

export default useCarsStore;

