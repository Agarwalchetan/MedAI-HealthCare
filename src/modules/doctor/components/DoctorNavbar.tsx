import React from 'react';
import { LogOut, User, Bell, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doctorAPI } from '../services/doctorAPI';

interface DoctorNavbarProps {
  onMenuToggle?: () => void;
  doctor?: any;
}

const DoctorNavbar: React.FC<DoctorNavbarProps> = ({ onMenuToggle, doctor }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await doctorAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('doctor');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 mr-3"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Doctor Dashboard
            </h1>
            {!doctor?.isVerified && (
              <span className="ml-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Verification Pending
              </span>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>

            {/* Doctor Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{doctor?.fullName}</p>
                  <p className="text-xs text-gray-500">{doctor?.specialization}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;