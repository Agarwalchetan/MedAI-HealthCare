import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Zap, Brain, CheckCircle, Stethoscope, FlaskConical, CreditCard, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Diagnosis',
      description: 'Advanced machine learning algorithms for accurate preliminary diagnosis and health insights.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Health Records',
      description: 'Bank-level security with encrypted storage and HIPAA-compliant data management.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Connected Ecosystem',
      description: 'Seamless integration between patients, doctors, labs, and insurance providers.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Real-time Updates',
      description: 'Instant notifications for test results, appointments, and important health information.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served' },
    { number: '1K+', label: 'Healthcare Providers' },
    { number: '99.9%', label: 'System Uptime' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Intelligent
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Healthcare Companion
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered healthcare platform connecting patients, doctors, labs, and insurers seamlessly. 
              Experience healthcare reimagined with intelligent insights and coordinated care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Watch Demo
              </button>
            </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
                      <p className="text-sm text-gray-600">Analyzing symptoms...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">"I have a persistent headache and feel tired"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">Based on your symptoms, this could be tension headache. I recommend rest and monitoring. Would you like to book an appointment with a doctor?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mt-12">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MedAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless healthcare journey powered by AI and connected ecosystem
            </p>
          </div>

          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white p-4 rounded-full inline-block mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Patient Signup</h3>
                <p className="text-sm text-gray-600">Create profile and secure health vault</p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white p-4 rounded-full inline-block mb-4">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
                <p className="text-sm text-gray-600">AI analyzes symptoms and suggests care</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-4 rounded-full inline-block mb-4">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Doctor Consultation</h3>
                <p className="text-sm text-gray-600">Connect with verified healthcare professionals</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 text-white p-4 rounded-full inline-block mb-4">
                  <FlaskConical className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Lab Integration</h3>
                <p className="text-sm text-gray-600">Seamless lab reports and test management</p>
              </div>

              <div className="text-center">
                <div className="bg-red-600 text-white p-4 rounded-full inline-block mb-4">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Insurance Claims</h3>
                <p className="text-sm text-gray-600">Automated insurance processing</p>
              </div>
            </div>

            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-green-600 via-purple-600 via-orange-600 to-red-600 opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Healthcare Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized features designed for patients, doctors, labs, insurance providers, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Patients</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• AI-powered health insights</li>
                <li>• Secure health vault</li>
                <li>• Easy appointment booking</li>
                <li>• Prescription management</li>
              </ul>
              <div className="mt-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  ✅ Available Now
                </span>
              </div>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Doctors</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Patient management</li>
                <li>• AI diagnosis assistance</li>
                <li>• Digital prescriptions</li>
                <li>• Earnings tracking</li>
              </ul>
              <div className="mt-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  ✅ Available Now
                </span>
              </div>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 opacity-75">
              <div className="bg-purple-100 text-purple-600 p-4 rounded-full inline-block mb-4">
                <FlaskConical className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Labs</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Test result management</li>
                <li>• Direct patient delivery</li>
                <li>• Quality control</li>
                <li>• Integration APIs</li>
              </ul>
              <div className="mt-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  🔒 Coming Soon
                </span>
              </div>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 opacity-75">
              <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Insurance</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Automated claims</li>
                <li>• Coverage verification</li>
                <li>• Policy management</li>
                <li>• Payment processing</li>
              </ul>
              <div className="mt-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  🔒 Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform brings together cutting-edge technology and healthcare expertise 
              to deliver exceptional patient care and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust MedAI for their healthcare needs.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;