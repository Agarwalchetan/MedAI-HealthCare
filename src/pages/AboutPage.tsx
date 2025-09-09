import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Lightbulb, 
  ArrowRight, 
  Brain, 
  Shield,
  Heart,
  Stethoscope,
  FlaskConical,
  CreditCard,
  Settings,
  Truck,
  CheckCircle,
  Star,
  Quote,
  Zap,
  Globe,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const mission = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To democratize healthcare access through intelligent technology, making quality care available to everyone, everywhere.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI and machine learning to provide accurate diagnoses and personalized treatment recommendations.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Patient-Centered',
      description: 'Every feature is designed with patients at the center, ensuring seamless experiences and better health outcomes.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const ecosystem = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'For Patients',
      description: 'AI-powered health insights, secure health vault, easy appointment booking, and 24/7 support.',
      features: ['AI Health Assistant', 'Digital Health Vault', 'Smart Appointments', 'Medicine Database'],
      color: 'from-pink-500 to-pink-600',
      status: 'available'
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'For Doctors',
      description: 'Patient management tools, AI diagnosis assistance, digital prescriptions, and earnings tracking.',
      features: ['Patient Dashboard', 'AI Diagnosis Review', 'Digital Prescriptions', 'Earnings Analytics'],
      color: 'from-blue-500 to-blue-600',
      status: 'available'
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: 'For Labs',
      description: 'Streamlined test management, digital report delivery, and seamless integration with patient records.',
      features: ['Test Management', 'Digital Reports', 'Quality Control', 'Patient Integration'],
      color: 'from-purple-500 to-purple-600',
      status: 'coming-soon'
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'For Insurance',
      description: 'Automated claims processing, coverage verification, and transparent policy management.',
      features: ['Claims Processing', 'Coverage Verification', 'Policy Management', 'Payment Integration'],
      color: 'from-orange-500 to-orange-600',
      status: 'coming-soon'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'For Administrators',
      description: 'Comprehensive system management, user oversight, and platform analytics.',
      features: ['User Management', 'System Analytics', 'Security Controls', 'Compliance Tools'],
      color: 'from-red-500 to-red-600',
      status: 'available'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'For Paramedics',
      description: 'Location-based emergency response, real-time booking, and community health support.',
      features: ['Emergency Response', 'Location Services', 'Real-time Booking', 'Rural Coverage'],
      color: 'from-teal-500 to-teal-600',
      status: 'available'
    }
  ];

  const timeline = [
    {
      phase: 'Idea Stage',
      period: '2024 - Early',
      title: 'The Vision',
      description: 'Identified the healthcare inequality gap in India where 70% live in rural areas but 80% of specialists are in cities.',
      icon: <Lightbulb className="h-6 w-6" />,
      color: 'bg-yellow-500',
      status: 'completed'
    },
    {
      phase: 'Conceptualization',
      period: '2024 - Mid',
      title: 'Patient-First Design',
      description: 'Designed wireframes with patients at the center, surrounded by doctors, labs, and insurance ecosystem.',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-purple-500',
      status: 'completed'
    },
    {
      phase: 'Development Kickoff',
      period: '2025 - Early',
      title: 'MVP Launch',
      description: 'Built scalable MERN architecture with modular MVC structure. Launched Patient Portal with full functionality.',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-blue-500',
      status: 'completed'
    },
    {
      phase: 'Doctor Portal',
      period: '2025 - Current',
      title: 'Healthcare Providers',
      description: 'Added doctor dashboard with patient management, AI diagnosis monitoring, and digital prescriptions.',
      icon: <Stethoscope className="h-6 w-6" />,
      color: 'bg-green-500',
      status: 'in-progress'
    },
    {
      phase: 'Admin & Analytics',
      period: '2025 - Q2',
      title: 'System Management',
      description: 'Comprehensive admin panel for user management, system analytics, and compliance monitoring.',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-red-500',
      status: 'planned'
    },
    {
      phase: 'Labs & Insurance',
      period: '2025 - Q3',
      title: 'Ecosystem Integration',
      description: 'Connect labs for digital reports and integrate insurance workflows for transparent, affordable care.',
      icon: <FlaskConical className="h-6 w-6" />,
      color: 'bg-orange-500',
      status: 'planned'
    },
    {
      phase: 'Global Expansion',
      period: '2026 & Beyond',
      title: 'The Future',
      description: 'Wearable integration, predictive healthcare insights, rural India expansion, and global scaling.',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-indigo-500',
      status: 'future'
    }
  ];

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Medical Officer & Co-Founder',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: '15+ years in digital health innovation',
      quote: '"We\'re not just coding healthcare; we\'re saving lives, one algorithm at a time!"',
      expertise: 'Digital Health Strategy'
    },
    {
      name: 'Arjun Patel',
      role: 'Head of AI Research & Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Former Google Health AI researcher',
      quote: '"Teaching machines to understand human health is like giving superpowers to doctors!"',
      expertise: 'Machine Learning & AI'
    },
    {
      name: 'Sneha Rodriguez',
      role: 'VP of Engineering & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b4e86bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Expert in scalable healthcare systems',
      quote: '"Building software that scales from villages to metros - that\'s the real challenge!"',
      expertise: 'Full-Stack Architecture'
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Clinical Advisor & Cardiologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Board-certified physician and health tech pioneer',
      quote: '"Technology should enhance the doctor-patient relationship, not replace it!"',
      expertise: 'Clinical Excellence'
    },
    {
      name: 'Maya Singh',
      role: 'Head of Patient Experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Healthcare UX specialist with patient advocacy background',
      quote: '"Every pixel we design should make a patient\'s day a little bit better!"',
      expertise: 'User Experience Design'
    },
    {
      name: 'Vikram Mehta',
      role: 'Chief Security Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Cybersecurity expert specializing in healthcare data protection',
      quote: '"Your health data is more precious than gold - we guard it like Fort Knox!"',
      expertise: 'Healthcare Security & Compliance'
    }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Patient First',
      description: 'Every decision we make starts with asking: "How does this help our patients?"',
      color: 'text-red-600'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Trust & Security',
      description: 'Your health data is sacred. We protect it with bank-level security and transparency.',
      color: 'text-blue-600'
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Intelligent Innovation',
      description: 'We harness AI not to replace doctors, but to make them more effective and accessible.',
      color: 'text-purple-600'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Inclusive Healthcare',
      description: 'Quality healthcare should not depend on your location, income, or social status.',
      color: 'text-green-600'
    }
  ];

  const differentiators = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI That Actually Helps',
      description: 'Our AI doesn\'t just store data - it understands patterns, predicts risks, and provides actionable insights in simple language.',
      stats: '94% accuracy rate',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Your Data, Your Control',
      description: 'Complete ownership of your health records with granular privacy controls. Share what you want, when you want.',
      stats: 'HIPAA compliant',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Connected Care Ecosystem',
      description: 'Seamless integration between patients, doctors, labs, and insurance - no more fragmented healthcare.',
      stats: '5 stakeholder types',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Emergency Ready',
      description: 'From AI triage to paramedic dispatch - we\'re built for both routine care and emergency situations.',
      stats: '24/7 availability',
      color: 'from-red-500 to-red-600'
    }
  ];

  const futureFeatures = [
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Wearable Integration',
      description: 'Connect smartwatches and IoT devices for continuous health monitoring',
      timeline: '2026 Q1'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Predictive Analytics',
      description: 'AI-powered health predictions to prevent diseases before they occur',
      timeline: '2026 Q2'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Rural Expansion',
      description: 'Offline-first support for healthcare access in remote areas',
      timeline: '2026 Q3'
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Advanced AI',
      description: 'Next-generation AI models for specialized medical conditions',
      timeline: '2026 Q4'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served', icon: <Users className="h-6 w-6" /> },
    { number: '1K+', label: 'Healthcare Providers', icon: <Stethoscope className="h-6 w-6" /> },
    { number: '99.9%', label: 'System Uptime', icon: <Zap className="h-6 w-6" /> },
    { number: '24/7', label: 'AI Support Available', icon: <Clock className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              <span>Redefining Healthcare</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Healthcare That
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Actually Cares
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              MedAI is more than just an app — it's a digital healthcare ecosystem built around patients 
              while empowering doctors, labs, paramedics, administrators, and insurance providers to work together seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Watch Our Story
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
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
                <span>24/7 AI Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Doctor Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white bg-opacity-20 text-white p-3 rounded-xl inline-block mb-3">
                  {stat.icon}
                </div>
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

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="h-4 w-4" />
                <span>Our Story</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Patients, Powered by Innovation
              </h2>
              
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  MedAI was founded with a mission to solve one of India's biggest challenges: 
                  <strong className="text-gray-900"> Healthcare Access & Inequality</strong>.
                </p>
                <p>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">70% of Indians live in rural areas</span>, 
                  yet <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-medium">80% of specialists are in cities</span>.
                </p>
                <p>
                  MedAI bridges this gap with AI-driven diagnosis, digital health vaults, 
                  and remote access to doctors & paramedics, making quality healthcare accessible to everyone.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full inline-block mb-4">
                      <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Patient-First Philosophy</h3>
                    <p className="text-gray-600 text-sm">
                      Every feature, every decision, every line of code is written with one question: 
                      "How does this make healthcare better for patients?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded on the belief that technology can make healthcare more accessible, 
              accurate, and efficient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {mission.map((item, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${item.color} text-white p-4 rounded-xl inline-block mb-6`}>
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

          {/* Core Values */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center p-4">
                  <div className={`${value.color} p-3 rounded-full inline-block mb-3`}>
                    {value.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why MedAI Stands Out */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why MedAI Stands Out
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another healthcare app. We're building the future of connected, intelligent healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-r ${item.color} text-white p-3 rounded-xl flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.stats}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Healthcare Ecosystem */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for the Entire Healthcare Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MedAI connects every stakeholder in healthcare, creating a seamless experience for all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosystem.map((role, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  {/* Status Badge */}
                  <div className="absolute top-0 right-0">
                    {role.status === 'available' ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        ✅ Available
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        🔒 Coming Soon
                      </span>
                    )}
                  </div>

                  <div className={`bg-gradient-to-r ${role.color} text-white p-4 rounded-xl inline-block mb-6`}>
                    {role.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{role.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{role.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to impact - see how we're building the future of healthcare
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600 hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 lg:pr-8">
                    <div className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 ${
                      index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`${item.color} text-white p-2 rounded-lg`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{item.phase}</h3>
                          <p className="text-sm text-gray-600">{item.period}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.status === 'completed' ? 'Completed' :
                           item.status === 'in-progress' ? 'In Progress' :
                           item.status === 'planned' ? 'Planned' : 'Future'}
                        </span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-600 rounded-full shadow-lg z-10">
                    <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                  </div>

                  <div className="flex-1 lg:pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Humans Behind MedAI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare professionals, technology experts, and passionate innovators working together 
              to revolutionize medical care for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-center mb-2">
                      <Quote className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-blue-800 italic font-medium">{member.quote}</p>
                  </div>
                  
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {member.expertise}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              <span>The Future of Healthcare</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We're Just Getting Started
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our vision extends far beyond what you see today. Here's what's coming next in our mission 
              to transform healthcare globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureFeatures.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300">
                <div className="bg-white text-blue-600 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm mb-3 leading-relaxed">{feature.description}</p>
                <span className="bg-blue-500 bg-opacity-30 text-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                  {feature.timeline}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-blue-100 mb-6">
              "We're not just coding healthcare; we're saving lives, one algorithm at a time."
            </p>
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-full px-6 py-3">
                <span className="text-white font-medium">- The MedAI Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Healthcare Should Be Simple. Start with MedAI Today.
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of patients, doctors, and healthcare providers who trust MedAI 
            for smarter, more accessible healthcare. Your health journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/user/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-green-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign Up as Patient
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/doctor/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200 transform hover:scale-105"
            >
              Join as Doctor
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200 transform hover:scale-105">
              Partner with Us
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>30-Day Free Trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;