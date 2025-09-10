import React, { useState } from 'react';
import { 
  Heart, 
  Stethoscope, 
  Shield,
  Settings,
  ArrowRight,
  Clock,
  Activity,
  Users,
  CheckCircle,
  Brain,
  FileText,
  Calendar,
  Pill,
  UserCheck,
  TrendingUp,
  Bell,
  Lock,
  BarChart3,
  Database,
  Zap
} from 'lucide-react';

const AuthPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'patient',
      title: 'Patients',
      subtitle: 'Manage your healthcare',
      icon: <Heart className="h-8 w-8" />,
      description: 'Access your medical records, get AI-powered health insights, and manage your healthcare journey with complete control.',
      status: 'available',
      path: '/user/login',
      color: 'from-emerald-600 to-emerald-700',
      features: ['Medical Records Access', 'AI Health Insights', 'Appointment Management', 'Prescription Tracking'],
      stats: '50,000+ Patients',
      demoElements: [
        { icon: Brain, label: 'AI Health Assistant', delay: 0 },
        { icon: FileText, label: 'Digital Health Records', delay: 0.2 },
        { icon: Calendar, label: 'Smart Scheduling', delay: 0.4 },
        { icon: Pill, label: 'Medication Reminders', delay: 0.6 }
      ]
    },
    {
      id: 'doctor',
      title: 'Doctors',
      subtitle: 'Professional medical practice',
      icon: <Stethoscope className="h-8 w-8" />,
      description: 'Manage patients efficiently, access diagnostic tools, and provide exceptional care through our platform.',
      status: 'available',
      path: '/doctor/login',
      color: 'from-blue-600 to-blue-700',
      features: ['Patient Management', 'AI Diagnostic Tools', 'Digital Prescriptions', 'Practice Analytics'],
      stats: '1,000+ Doctors',
      demoElements: [
        { icon: Users, label: 'Patient Dashboard', delay: 0 },
        { icon: Brain, label: 'AI Diagnosis Support', delay: 0.2 },
        { icon: FileText, label: 'Digital Prescriptions', delay: 0.4 },
        { icon: TrendingUp, label: 'Practice Analytics', delay: 0.6 }
      ]
    },
    {
      id: 'guardian',
      title: 'Guardians',
      subtitle: 'Family healthcare management',
      icon: <Shield className="h-8 w-8" />,
      description: 'Manage healthcare for family members and dependents with secure access and coordination tools.',
      status: 'coming-soon',
      path: '#',
      color: 'from-purple-600 to-purple-700',
      features: ['Family Management', 'Emergency Access', 'Care Coordination', 'Medical Proxy'],
      stats: 'Coming Q2 2025',
      demoElements: [
        { icon: Users, label: 'Family Overview', delay: 0 },
        { icon: Bell, label: 'Emergency Alerts', delay: 0.2 },
        { icon: UserCheck, label: 'Care Coordination', delay: 0.4 },
        { icon: Lock, label: 'Secure Access', delay: 0.6 }
      ]
    },
    {
      id: 'administrator',
      title: 'Administrators',
      subtitle: 'System administration',
      icon: <Settings className="h-8 w-8" />,
      description: 'Comprehensive system administration with analytics, user management, and oversight tools.',
      status: 'available',
      path: '/admin/login',
      color: 'from-slate-600 to-slate-700',
      features: ['User Management', 'System Analytics', 'Security Controls', 'Compliance Tools'],
      stats: 'Enterprise Ready',
      demoElements: [
        { icon: BarChart3, label: 'System Analytics', delay: 0 },
        { icon: Database, label: 'Data Management', delay: 0.2 },
        { icon: Lock, label: 'Security Center', delay: 0.4 },
        { icon: Zap, label: 'Performance Monitor', delay: 0.6 }
      ]
    }
  ];

  const handleRoleSelect = (role: any) => {
    if (role.status === 'available') {
      setSelectedRole(role.id);
      setTimeout(() => {
        window.location.href = role.path;
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each portal is specifically designed with AI-powered features tailored to your role in healthcare.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`relative bg-white rounded-xl border border-gray-200 p-8 transition-all duration-300 transform ${
                role.status === 'available' 
                  ? 'cursor-pointer hover:shadow-xl hover:border-blue-300 hover:-translate-y-1' 
                  : 'cursor-not-allowed opacity-75'
              } ${selectedRole === role.id ? 'ring-2 ring-blue-500 border-blue-300' : ''} overflow-hidden`}
              style={{
                minHeight: '500px'
              }}
            >
              {/* Animated Background Pattern */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
                hoveredRole === role.id ? 'opacity-5' : ''
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color}`}></div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                {role.status === 'available' ? (
                  <div className={`flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                    hoveredRole === role.id ? 'scale-110 bg-green-200' : ''
                  }`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Available</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="h-3 w-3" />
                    <span>Coming Soon</span>
                  </div>
                )}
              </div>

              {/* Icon with Animation */}
              <div className={`inline-flex items-center justify-center p-4 bg-gradient-to-r ${role.color} text-white rounded-lg mb-6 transition-all duration-300 ${
                hoveredRole === role.id ? 'scale-110 shadow-lg' : ''
              }`}>
                <div className={`transition-transform duration-300 ${
                  hoveredRole === role.id ? 'animate-pulse' : ''
                }`}>
                  {role.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 relative z-10">
                <div>
                  <h3 className={`text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300 ${
                    hoveredRole === role.id ? 'text-blue-700' : ''
                  }`}>
                    {role.title}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {role.subtitle}
                  </p>
                </div>

                <p className="text-gray-600 text-base leading-relaxed">
                  {role.description}
                </p>

                {/* Animated Demo Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Portal Features:</h4>
                  <div className="space-y-2">
                    {role.demoElements.map((element, index) => {
                      const IconComponent = element.icon;
                      return (
                        <div
                          key={index}
                          className={`flex items-center text-sm text-gray-600 transition-all duration-500 ${
                            hoveredRole === role.id 
                              ? 'transform translate-x-2 text-gray-800' 
                              : ''
                          }`}
                          style={{
                            transitionDelay: hoveredRole === role.id ? `${element.delay}s` : '0s'
                          }}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mr-3 transition-all duration-500 ${
                            hoveredRole === role.id 
                              ? 'scale-110 shadow-md animate-pulse' 
                              : 'scale-90 opacity-70'
                          }`}
                          style={{
                            transitionDelay: hoveredRole === role.id ? `${element.delay}s` : '0s'
                          }}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <span className={`font-medium transition-all duration-300 ${
                            hoveredRole === role.id ? 'text-gray-900' : ''
                          }`}>
                            {element.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats with Animation */}
                <div className={`bg-gray-50 rounded-lg p-4 border border-gray-100 transition-all duration-300 ${
                  hoveredRole === role.id ? 'bg-blue-50 border-blue-200 shadow-md' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-gray-600 text-sm transition-colors duration-300 ${
                      hoveredRole === role.id ? 'text-blue-700' : ''
                    }`}>Platform Usage</span>
                    <span className={`text-gray-900 font-semibold text-sm transition-all duration-300 ${
                      hoveredRole === role.id ? 'text-blue-900 scale-105' : ''
                    }`}>
                      {role.stats}
                    </span>
                  </div>
                </div>

                {/* Action Button with Animation */}
                <div className="pt-2">
                  {role.status === 'available' ? (
                    <button
                      className={`w-full bg-gradient-to-r ${role.color} text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 ${
                        hoveredRole === role.id ? 'shadow-lg scale-105 shadow-blue-200' : 'hover:shadow-md'
                      }`}
                    >
                      <span>Access {role.title} Portal</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                        hoveredRole === role.id ? 'translate-x-1' : ''
                      }`} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 rounded-xl transition-opacity duration-500 pointer-events-none ${
                hoveredRole === role.id ? 'opacity-5' : ''
              }`}></div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Platform Statistics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">99.9%</div>
                <div className="text-blue-600 text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">51K+</div>
                <div className="text-blue-600 text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">24/7</div>
                <div className="text-blue-600 text-sm">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;