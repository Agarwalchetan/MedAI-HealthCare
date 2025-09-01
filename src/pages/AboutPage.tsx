import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Lightbulb, ArrowRight, Brain, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
  const mission = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To democratize healthcare access through intelligent technology, making quality care available to everyone, everywhere.'
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI and machine learning to provide accurate diagnoses and personalized treatment recommendations.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Patient-Centered',
      description: 'Every feature is designed with patients at the center, ensuring seamless experiences and better health outcomes.'
    }
  ];

  const roadmap = [
    { phase: 'Phase 1', title: 'Patient Portal', status: 'completed', description: 'Full patient dashboard with AI chatbot and medical records' },
    { phase: 'Phase 2', title: 'Doctor Network', status: 'in-progress', description: 'Doctor registration, appointments, and telemedicine' },
    { phase: 'Phase 3', title: 'Lab Integration', status: 'planned', description: 'Laboratory management and automated reporting' },
    { phase: 'Phase 4', title: 'Insurance Claims', status: 'planned', description: 'Automated insurance processing and verification' },
    { phase: 'Phase 5', title: 'Admin & Analytics', status: 'planned', description: 'System administration and comprehensive analytics' },
    { phase: 'Phase 6', title: 'Mobile Apps', status: 'planned', description: 'Native iOS and Android applications' }
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

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: '15+ years in digital health innovation'
    },
    {
      name: 'Michael Chen',
      role: 'Head of AI Research',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Former Google Health AI researcher'
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Engineering',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b4e86bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Expert in scalable healthcare systems'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Clinical Advisor',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Board-certified physician and health tech pioneer'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About MedAI
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're building the future of healthcare through artificial intelligence, 
            connecting every stakeholder in the healthcare ecosystem for better outcomes.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Purpose & Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Founded on the belief that technology can make healthcare more accessible, 
              accurate, and efficient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission.map((item, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-600 text-white p-4 rounded-xl inline-block mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Development Roadmap
            </h2>
            <p className="text-lg text-gray-600">
              Our phased approach to building a comprehensive healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmap.map((phase, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 border-l-4 transition-all duration-300 hover:shadow-lg ${
                  phase.status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : phase.status === 'in-progress'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{phase.phase}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    phase.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : phase.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {phase.status === 'completed' ? 'Live' : phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{phase.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              Healthcare professionals and technology experts working together to revolutionize medical care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedAI?
            </h2>
            <p className="text-lg text-gray-600">
              Built on cutting-edge technology and healthcare expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-blue-600 text-white p-3 rounded-xl inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our growing community of patients, doctors, and healthcare providers.
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

export default AboutPage;