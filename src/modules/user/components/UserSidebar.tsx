import React from 'react';
import { Home, User, FileText, Pill, FlaskConical, Shield, MapPin, Bot, Cable as Capsule, Calendar } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
}

interface UserSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/user/dashboard',
      available: true
    },
    {
      id: 'ai-chatbot',
      name: 'AI Diagnosis',
      icon: <Bot className="h-5 w-5" />,
      path: '/user/ai-chatbot',
      available: true
    },
    {
      id: 'appointments',
      name: 'Appointments',
      icon: <Calendar className="h-5 w-5" />,
      path: '/user/appointments',
      available: true
    },
    {
      id: 'health-vault',
      name: 'Health Vault',
      icon: <Shield className="h-5 w-5" />,
      path: '/user/health-vault',
      available: true
    },
    {
      id: 'medical-history',
      name: 'Medical History',
      icon: <FileText className="h-5 w-5" />,
      path: '/user/medical-history',
      available: true
    },
    {
      id: 'prescriptions',
      name: 'Prescriptions',
      icon: <Pill className="h-5 w-5" />,
      path: '/user/prescriptions',
      available: true
    },
    {
      id: 'lab-reports',
      name: 'Lab Reports',
      icon: <FlaskConical className="h-5 w-5" />,
      path: '/user/lab-reports',
      available: true
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: <Shield className="h-5 w-5" />,
      path: '/user/insurance',
      available: true
    },
    {
      id: 'paramedics',
      name: 'Paramedics',
      icon: <MapPin className="h-5 w-5" />,
      path: '/user/paramedics',
      available: true
    },
    {
      id: 'medicines',
      name: 'Medicines',
      icon: <Capsule className="h-5 w-5" />,
      path: '/user/medicines',
      available: true
    },
    {
      id: 'active-medicines',
      name: 'Active Medicines',
      icon: <Pill className="h-5 w-5" />,
      path: '/user/active-medicines',
      available: true
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/user/profile',
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
            <h2 className="text-lg font-semibold text-gray-900">Patient Portal</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your healthcare</p>
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
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : item.available
                    ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className={location.pathname === item.path ? 'text-blue-700' : item.available ? 'text-gray-500' : 'text-gray-300'}>
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
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-2">Contact our support team</p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;