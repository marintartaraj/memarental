import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  Car, 
  Users, 
  X, 
  LogOut, 
  Bell,
  ChevronRight,
  Home,
  Shield,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/admin',
      description: 'Overview and analytics'
    },
    { 
      id: 'bookings', 
      label: t('manageBookings'), 
      icon: Calendar, 
      path: '/admin/bookings',
      description: 'Manage reservations'
    },
    { 
      id: 'cars', 
      label: t('manageCars'), 
      icon: Car, 
      path: '/admin/cars',
      description: 'Vehicle management'
    },
    { 
      id: 'users', 
      label: t('users'), 
      icon: Users, 
      path: '/admin/users',
      description: 'User management'
    },
  ];



  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'overview';
    if (path === '/admin/bookings') return 'bookings';
    if (path === '/admin/cars') return 'cars';
    if (path === '/admin/users') return 'users';
    return 'overview';
  };

  const currentTab = getCurrentTab();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              {/* Modern Admin Sidebar Logo */}
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Shield Icon */}
                  <Shield className="h-5 w-5 text-white drop-shadow-sm relative z-10" />
                  
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Modern Admin Sidebar Typography */}
              <div>
                <div className="flex items-baseline space-x-1">
                  <h1 className="text-lg font-bold text-gray-900">MEMA</h1>
                  <span className="text-xs font-medium text-yellow-600">®</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold text-gray-700">ADMIN</span>
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-500">Car Rental Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </header>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Navigation */}
            <div>
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                Main Navigation
              </h2>
              <ul className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className={`h-5 w-5 mr-3 ${
                          isActive ? 'text-yellow-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-yellow-600" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>


          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start text-gray-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
