import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  Brain, 
  Pill, 
  DollarSign, 
  User, 
  Stethoscope 
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
}

interface DoctorSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/doctor/dashboard',
      available: true
    },
    {
      id: 'patients',
      name: 'Patients',
      icon: <Users className="h-5 w-5" />,
      path: '/doctor/patients',
      available: true
    },
    {
      id: 'appointments',
      name: 'Appointments',
      icon: <Calendar className="h-5 w-5" />,
      path: '/doctor/appointments',
      available: true
    },
    {
      id: 'ai-diagnosis',
      name: 'AI Diagnosis',
      icon: <Brain className="h-5 w-5" />,
      path: '/doctor/ai-diagnosis',
      available: true
    },
    {
      id: 'prescriptions',
      name: 'Prescriptions',
      icon: <Pill className="h-5 w-5" />,
      path: '/doctor/prescriptions',
      available: true
    },
    {
      id: 'earnings',
      name: 'Earnings',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/doctor/earnings',
      available: true
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/doctor/profile',
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
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Doctor Portal</h2>
                <p className="text-sm text-gray-500">Manage your practice</p>
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
              <h3 className="font-medium text-blue-900 mb-1">Medical Support</h3>
              <p className="text-sm text-blue-700 mb-2">24/7 technical assistance</p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;