import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Download, 
  RefreshCw, 
  Mail, 
  Calendar, 
  Shield,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast.jsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useOptimizedPagination } from '@/hooks/useOptimizedPagination';
import { Pagination } from '@/components/ui/pagination';
import { AdvancedFilter } from '@/components/ui/advanced-filter';

const OptimizedAdminUsers = () => {
  const { t } = useLanguage();
  
  // Use optimized pagination hook
  const {
    data: profiles,
    loading,
    refreshing,
    error,
    currentPage,
    totalPages,
    totalCount,
    paginationInfo,
    filters,
    filterOptions,
    hasFilters,
    handlePageChange,
    handleRefresh,
    handleFilterChange,
    handleFiltersChange,
    loadFilterOptions,
    isEmpty
  } = useOptimizedPagination('profiles', {
    initialLimit: 20,
    initialFilters: {
      search: '',
      status: 'all'
    }
  });

  // Form state
  const [editingUser, setEditingUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions(['status']);
  }, [loadFilterOptions]);

  // Handle user form submission
  const handleUserSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (editingUser) {
        result = await supabase
          .from('profiles')
          .update(userFormData)
          .eq('id', editingUser.id)
          .select();
        
        if (result.error) throw result.error;
        
        toast({
          title: "User Updated",
          description: "User profile has been updated successfully.",
        });
      }
      
      // Refresh data and clear cache
      handleRefresh();
      setIsUserDialogOpen(false);
      resetUserForm();
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Operation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editingUser, userFormData, handleRefresh]);

  // Handle edit user
  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setUserFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setIsUserDialogOpen(true);
  }, []);

  // Reset user form
  const resetUserForm = useCallback(() => {
    setEditingUser(null);
    setUserFormData({
      full_name: '',
      email: '',
      phone: ''
    });
  }, []);

  // Handle delete user
  const handleDeleteUser = useCallback(async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully!",
      });

      handleRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [handleRefresh]);

  // Handle toggle user status - removed since is_active column doesn't exist
  const handleToggleUserStatus = useCallback(async (user) => {
    toast({
      title: "Info",
      description: "User status toggle not available - is_active column not found in database",
    });
  }, []);

  // Export function
  const exportToCSV = useCallback((data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header] || ''
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    exportToCSV(profiles, `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: "Export Successful",
      description: "User data has been exported to CSV.",
    });
  }, [profiles, exportToCSV]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = profiles.length;
    
    return {
      totalUsers,
      activeUsers: totalUsers, // All users are considered active since is_active column doesn't exist
      inactiveUsers: 0
    };
  }, [profiles]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Admin Users - MEMA Rental</title>
        <meta name="description" content="Manage user accounts and profiles" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-2">Manage user accounts and profiles</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setIsUserDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <AdvancedFilter
            filters={filters}
            filterOptions={{
              status: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]
            }}
            onFilterChange={handleFilterChange}
            onFiltersChange={handleFiltersChange}
            searchPlaceholder="Search users by name or email..."
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <Button onClick={handleRefresh} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : isEmpty ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">
                  {hasFilters ? 'Try adjusting your search or filter criteria.' : 'No users have been registered yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {profiles.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {user.full_name || 'Unnamed User'}
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.email || 'No email'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationInfo={paginationInfo}
          />
        </div>
      </div>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={userFormData.full_name}
                onChange={(e) => setUserFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={userFormData.phone}
                onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptimizedAdminUsers;
