import React, { useState } from 'react';
import { 
  Heart, 
  Stethoscope, 
  FlaskConical, 
  CreditCard, 
  Settings, 
  Shield,
  ArrowRight,
  Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'patient',
      title: 'Patients',
      icon: <Heart className="h-12 w-12" />,
      description: 'Access your medical records, get AI-powered health insights, and manage your healthcare journey.',
      status: 'available',
      path: '/user/login',
      color: 'from-green-500 to-green-600',
      features: ['Medical Records', 'AI Chatbot', 'Lab Reports', 'Prescriptions']
    },
    {
      id: 'doctor',
      title: 'Doctors',
      icon: <Stethoscope className="h-12 w-12" />,
      description: 'Manage patients, schedule appointments, and provide telemedicine consultations.',
      status: 'available',
      path: '/doctor/login',
      color: 'from-blue-500 to-blue-600',
      features: ['Patient Management', 'Appointments', 'Telemedicine', 'Prescriptions']
    },
    {
      id: 'guardian',
      title: 'Guardians',
      icon: <Shield className="h-12 w-12" />,
      description: 'Manage healthcare for family members and dependents with secure access controls.',
      status: 'coming-soon',
      path: '#',
      color: 'from-purple-500 to-purple-600',
      features: ['Family Management', 'Emergency Access', 'Medical Proxy', 'Notifications']
    },
    {
      id: 'administrator',
      title: 'Administrators',
      icon: <Settings className="h-12 w-12" />,
      description: 'System administration, user management, and platform analytics dashboard.',
      status: 'coming-soon',
      path: '#',
      color: 'from-gray-500 to-gray-600',
      features: ['User Management', 'Analytics', 'Security', 'Platform Config']
    }
  ];

  const handleRoleSelect = (role: any) => {
    if (role.status === 'available') {
      setSelectedRole(role.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Role
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select your role to access the appropriate features and dashboard for your healthcare needs.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:scale-105 ${
                  role.status === 'available'
                    ? 'border-green-200 hover:border-green-300 cursor-pointer hover:shadow-xl'
                    : 'border-gray-200 opacity-75'
                } ${selectedRole === role.id ? 'ring-4 ring-green-200 border-green-400' : ''}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {role.status === 'available' ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Coming Soon</span>
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`bg-gradient-to-r ${role.color} text-white p-4 rounded-xl inline-block mb-6`}>
                  {role.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {role.status === 'available' ? (
                  <Link
                    to={role.path}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-blue-600 rounded-2xl text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Currently Available: Patient Portal
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your healthcare journey today with our fully functional patient dashboard. 
              More roles and features will be added in upcoming phases.
            </p>
            <Link
              to="/user/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              Access Patient Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;