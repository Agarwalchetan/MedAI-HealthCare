import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  FlaskConical, 
  CreditCard, 
  Calendar,
  BarChart3,
  Bell,
  Settings,
  Shield,
  Pill
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
  badge?: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/admin/dashboard',
      available: true
    },
    {
      id: 'manage-users',
      name: 'Manage Patients',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/manage-users',
      available: true
    },
    {
      id: 'manage-medicines',
      name: 'Manage Medicines',
      icon: <Pill className="h-5 w-5" />,
      path: '/admin/manage-medicines',
      available: true
    },
    {
      id: 'manage-doctors',
      name: 'Manage Doctors',
      icon: <UserCheck className="h-5 w-5" />,
      path: '/admin/manage-doctors',
      available: true,
      badge: '12'
    },
    {
      id: 'manage-labs',
      name: 'Manage Labs',
      icon: <FlaskConical className="h-5 w-5" />,
      path: '/admin/manage-labs',
      available: true
    },
    {
      id: 'manage-insurance',
      name: 'Manage Insurance',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/admin/manage-insurance',
      available: false
    },
    {
      id: 'appointments',
      name: 'Appointments & Approvals',
      icon: <Calendar className="h-5 w-5" />,
      path: '/admin/appointments',
      available: true
    },
    {
      id: 'analytics',
      name: 'Analytics & Reports',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/analytics',
      available: true
    },
    {
      id: 'notifications',
      name: 'Notifications & Logs',
      icon: <Bell className="h-5 w-5" />,
      path: '/admin/notifications',
      available: true
    },
    {
      id: 'settings',
      name: 'System Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings',
      available: true
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:shadow-none md:border-r md:border-gray-200 w-64 flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Portal</h2>
                <p className="text-sm text-gray-500">System Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                    : item.available
                    ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={location.pathname === item.path ? 'text-red-700' : item.available ? 'text-gray-500' : 'text-gray-300'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {item.badge && item.available && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {!item.available && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-1">System Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-red-700">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;