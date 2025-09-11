import React from 'react';
import { 
  Home, 
  FileText, 
  Upload, 
  CheckCircle, 
  BarChart3, 
  Users, 
  Settings,
  FlaskConical,
  Calendar,
  Shield
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
}

interface LabSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const LabSidebar: React.FC<LabSidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/lab/dashboard',
      available: true
    },
    {
      id: 'upload-report',
      name: 'Upload Report',
      icon: <Upload className="h-5 w-5" />,
      path: '/lab/upload-report',
      available: true
    },
    {
      id: 'reports',
      name: 'Manage Reports',
      icon: <FileText className="h-5 w-5" />,
      path: '/lab/reports',
      available: true
    },
    {
      id: 'requests',
      name: 'Lab Requests',
      icon: <Calendar className="h-5 w-5" />,
      path: '/lab/requests',
      available: true
    },
    {
      id: 'quality-control',
      name: 'Quality Control',
      icon: <CheckCircle className="h-5 w-5" />,
      path: '/lab/quality-control',
      available: true
    },
    {
      id: 'patients',
      name: 'Patient Reports',
      icon: <Users className="h-5 w-5" />,
      path: '/lab/patients',
      available: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/lab/analytics',
      available: true
    },
    {
      id: 'profile',
      name: 'Lab Profile',
      icon: <Settings className="h-5 w-5" />,
      path: '/lab/profile',
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
              <div className="bg-purple-600 text-white p-2 rounded-lg">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Lab Portal</h2>
                <p className="text-sm text-gray-500">Diagnostic Services</p>
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : item.available
                    ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className={location.pathname === item.path ? 'text-purple-700' : item.available ? 'text-gray-500' : 'text-gray-300'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {!item.available && (
                  <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-1">Lab Support</h3>
              <p className="text-sm text-purple-700 mb-2">Technical assistance available</p>
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabSidebar;