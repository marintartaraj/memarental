import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Activity,
  Database,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { adminService } from '@/lib/adminService';
import PerformanceMonitor from '@/components/PerformanceMonitor';

const OptimizedAdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [performanceStats, setPerformanceStats] = useState({
    cacheHitRate: 0,
    cacheSize: 0,
    maxCacheSize: 100
  });

  // Update performance stats
  useEffect(() => {
    const updateStats = () => {
      try {
        const stats = adminService.getCacheStats();
        setPerformanceStats({
          cacheHitRate: Number(stats.hitRate) || 0,
          cacheSize: Number(stats.size) || 0,
          maxCacheSize: Number(stats.maxSize) || 100
        });
      } catch (error) {
        console.error('Error updating performance stats:', error);
        // Keep current stats if there's an error
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Cars', href: '/admin/cars', icon: Car },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const clearCache = () => {
    try {
      adminService.clearAllCache();
      setPerformanceStats({
        cacheHitRate: 0,
        cacheSize: 0,
        maxCacheSize: 100
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Panel - MEMA Rental</title>
        <meta name="description" content="Admin panel for MEMA Rental management" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Helmet>

      {/* Mobile sidebar - Mobile first approach */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl">
          <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">MEMA Admin</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-yellow-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile user section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user?.email || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MEMA Admin</h1>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-yellow-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Performance Stats */}
          <div className="p-4 border-t border-gray-200">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Performance</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCache}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Cache Hit Rate</span>
                    <span className={`font-medium ${
                      (performanceStats.cacheHitRate || 0) >= 80 ? 'text-green-600' :
                      (performanceStats.cacheHitRate || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(performanceStats.cacheHitRate || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Cache Usage</span>
                    <span className="font-medium text-blue-600">
                      {performanceStats.cacheSize}/{performanceStats.maxCacheSize}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(performanceStats.cacheSize / performanceStats.maxCacheSize) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user?.email || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Mobile first */}
      <div className="md:pl-64">
        {/* Top bar - Mobile optimized */}
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-3 border-b border-gray-200 bg-white px-3 shadow-sm md:h-16 md:gap-x-4 md:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-10 w-10 p-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-3 self-stretch md:gap-x-6">
            <div className="flex flex-1 items-center justify-end gap-x-2 md:gap-x-4">
              {/* Performance indicator - Responsive */}
              <div className="flex items-center gap-x-1 text-xs text-gray-500 md:text-sm md:gap-x-2">
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                  (performanceStats.cacheHitRate || 0) >= 80 ? 'bg-green-500' :
                  (performanceStats.cacheHitRate || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="hidden sm:inline">Performance: {(performanceStats.cacheHitRate || 0).toFixed(1)}%</span>
                <span className="sm:hidden">{(performanceStats.cacheHitRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Mobile optimized */}
        <main className="py-4 md:py-6">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OptimizedAdminLayout;
