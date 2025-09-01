import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Heart, 
  Users, 
  Building2, 
  Shield, 
  Brain,
  Stethoscope,
  FlaskConical,
  CreditCard,
  Settings,
  ArrowRight
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const moduleFeatures = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Patient Dashboard',
      description: 'Complete patient portal with medical records, prescriptions, and AI-powered health insights.',
      status: 'live',
      phase: 'Phase 1',
      features: ['Medical History', 'AI Chatbot', 'Lab Reports', 'Prescriptions', 'Insurance Management']
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'Doctor Portal',
      description: 'Comprehensive doctor interface for patient management, appointments, and telemedicine.',
      status: 'coming-soon',
      phase: 'Phase 2',
      features: ['Patient Management', 'Appointment Scheduling', 'Telemedicine', 'Prescription Writing', 'Revenue Dashboard']
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: 'Lab Management',
      description: 'Laboratory information system for test management and result delivery.',
      status: 'coming-soon',
      phase: 'Phase 3',
      features: ['Test Catalog', 'Result Management', 'Quality Control', 'Patient Reports', 'Integration APIs']
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Insurance Integration',
      description: 'Automated insurance claims processing and coverage verification system.',
      status: 'coming-soon',
      phase: 'Phase 4',
      features: ['Claims Processing', 'Coverage Verification', 'Policy Management', 'Payment Integration', 'Analytics']
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Admin Panel',
      description: 'System administration dashboard with user management and platform analytics.',
      status: 'coming-soon',
      phase: 'Phase 5',
      features: ['User Management', 'System Monitoring', 'Security Audit', 'Platform Config', 'Support System']
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Manager Tools',
      description: 'Healthcare facility management tools for staff coordination and resource optimization.',
      status: 'coming-soon',
      phase: 'Phase 6',
      features: ['Facility Management', 'Staff Scheduling', 'Resource Allocation', 'Financial Reports', 'Compliance']
    }
  ];

  const coreFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Diagnosis',
      description: 'Machine learning algorithms provide preliminary diagnosis based on symptoms and medical history.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, HIPAA compliance, and comprehensive audit trails for all data.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Multi-Role Platform',
      description: 'Unified platform serving patients, doctors, labs, insurance providers, and administrators.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Platform Features & Roadmap
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore our comprehensive healthcare platform modules and see what's currently available 
            and what's coming in future phases.
          </p>
        </div>
      </section>

      {/* Module Status Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Module Development Status
            </h2>
            <p className="text-lg text-gray-600">
              Track the progress of our modular healthcare platform development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {moduleFeatures.map((module, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                  module.status === 'live' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                    module.status === 'live'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {module.status === 'live' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    <span>{module.status === 'live' ? 'Live' : 'Coming Soon'}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{module.phase}</span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  module.status === 'live'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}>
                  {module.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {module.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {module.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Core Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Core Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 text-white p-3 rounded-xl inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start with Patient Portal Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Begin your healthcare journey with our fully functional patient dashboard, 
            and get early access to new features as they launch.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Get Started as Patient
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;