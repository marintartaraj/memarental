/**
 * useOptimizedPagination Hook
 * Provides server-side pagination, filtering, and sorting capabilities
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { paginationService } from '@/lib/paginationService';

export const useOptimizedPagination = (table, options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialFilters = {},
    initialSortBy = 'created_at',
    initialSortOrder = 'desc',
    joins = [],
    autoLoad = true
  } = options;

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({});

  // Filter state
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);

  // Sort state
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({});

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // Load data function
  const loadData = useCallback(async (page = currentPage, showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await paginationService.getPaginatedData(table, {
        page,
        limit: initialLimit,
        filters: debouncedFilters,
        sortBy,
        sortOrder,
        joins
      });

      setData(result.data);
      setPaginationInfo(result.pagination);
      setTotalPages(result.pagination.totalPages);
      setTotalCount(result.pagination.totalCount);
      setCurrentPage(result.pagination.currentPage);

    } catch (error) {
      console.error(`Error loading ${table} data:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [table, initialLimit, debouncedFilters, sortBy, sortOrder, joins, currentPage]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadData(1);
    }
  }, [loadData, autoLoad]);

  // Load filter options
  const loadFilterOptions = useCallback(async (filterTypes = []) => {
    try {
      const options = {};
      for (const filterType of filterTypes) {
        options[filterType] = await paginationService.getFilterOptions(table, filterType);
      }
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }, [table]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    loadData(newPage);
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    paginationService.clearTableCache(table);
    loadData(currentPage, true);
  }, [loadData, table, currentPage]);

  // Handle filter change
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  }, []);

  // Handle multiple filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setCurrentPage(1);
  }, []);

  // Handle sort
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  // Get sort icon
  const getSortIcon = useCallback((field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  }, [sortBy, sortOrder]);

  // Search suggestions
  const getSearchSuggestions = useCallback(async (searchTerm, limit = 10) => {
    try {
      return await paginationService.getSearchSuggestions(table, searchTerm, limit);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }, [table]);

  // Clear cache
  const clearCache = useCallback(() => {
    paginationService.clearTableCache(table);
  }, [table]);

  // Get pagination statistics
  const getStats = useCallback(() => {
    return paginationService.getPaginationStats();
  }, []);

  // Computed values
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);
  const isEmpty = useMemo(() => !loading && data.length === 0, [loading, data.length]);
  const hasFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== '' && v !== 'all');
      }
      return value !== '' && value !== 'all';
    });
  }, [filters]);

  return {
    // Data
    data,
    loading,
    refreshing,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    paginationInfo,
    hasNextPage,
    hasPrevPage,

    // Filters
    filters,
    filterOptions,
    hasFilters,

    // Sort
    sortBy,
    sortOrder,

    // Actions
    loadData,
    handlePageChange,
    handleRefresh,
    handleFilterChange,
    handleFiltersChange,
    handleSort,
    getSortIcon,
    getSearchSuggestions,
    loadFilterOptions,
    clearCache,
    getStats,

    // Computed
    isEmpty
  };
};

export default useOptimizedPagination;

