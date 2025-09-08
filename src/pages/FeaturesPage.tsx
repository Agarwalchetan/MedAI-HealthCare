import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  Shield, 
  Pill, 
  BarChart3, 
  MessageSquare,
  CreditCard,
  Users,
  AlertTriangle,
  BookOpen,
  Truck,
  ArrowRight,
  CheckCircle,
  Zap,
  Heart,
  Clock,
  Star
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 'ai-assistant',
      icon: <Brain className="h-8 w-8" />,
      title: 'Your Personal AI Doctor, Anytime',
      description: 'Chat with our AI-driven health assistant for instant symptom checks, preliminary guidance, and 24/7 health insights before meeting a doctor.',
      benefits: ['24/7 availability', 'Instant responses', 'Reduces anxiety', 'Saves time'],
      color: 'from-blue-500 to-blue-600',
      status: 'available'
    },
    {
      id: 'appointments',
      icon: <Calendar className="h-8 w-8" />,
      title: 'Book Doctors in a Few Clicks',
      description: 'Search, book, and manage appointments with doctors across specialties. Get follow-up notifications and complete digital scheduling.',
      benefits: ['No waiting lines', 'Digital scheduling', 'Follow-up reminders', 'Multi-specialty access'],
      color: 'from-green-500 to-green-600',
      status: 'available'
    },
    {
      id: 'health-vault',
      icon: <Shield className="h-8 w-8" />,
      title: 'Your Complete Health History in One Place',
      description: 'Secure digital vault storing all your medical records, lab reports, prescriptions, and imaging scans. You own your data completely.',
      benefits: ['Secure storage', 'No lost files', 'Doctor access control', 'Complete ownership'],
      color: 'from-purple-500 to-purple-600',
      status: 'available'
    },
    {
      id: 'smart-prescriptions',
      icon: <Pill className="h-8 w-8" />,
      title: 'Never Miss a Dose Again',
      description: 'Receive e-prescriptions directly in your vault with automated medicine reminders and refill alerts for better medication adherence.',
      benefits: ['E-prescriptions', 'Dose reminders', 'Refill alerts', 'Better adherence'],
      color: 'from-orange-500 to-orange-600',
      status: 'available'
    },
    {
      id: 'ai-insights',
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Understand Your Health Better',
      description: 'AI analyzes your health data to provide clear trends, risk warnings, and lifestyle suggestions in simple, understandable language.',
      benefits: ['Health trends', 'Risk warnings', 'Simple language', 'Lifestyle tips'],
      color: 'from-indigo-500 to-indigo-600',
      status: 'available'
    },
    {
      id: 'doctor-communication',
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Secure & Direct Access to Doctors',
      description: 'Message doctors securely, share reports instantly, and request clarifications on prescriptions for continuous care.',
      benefits: ['Secure messaging', 'Instant sharing', 'Follow-up care', 'Trust building'],
      color: 'from-teal-500 to-teal-600',
      status: 'coming-soon'
    },
    {
      id: 'affordable-care',
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Healthcare That Fits Your Pocket',
      description: 'Choose subscription plans for continuous care with future insurance integration for claim verification and cashless treatment.',
      benefits: ['Flexible plans', 'Insurance integration', 'Cashless care', 'Cost reduction'],
      color: 'from-pink-500 to-pink-600',
      status: 'coming-soon'
    },
    {
      id: 'family-access',
      icon: <Users className="h-8 w-8" />,
      title: 'Because Family Health Matters Too',
      description: 'Allow guardians to monitor health vaults and book appointments for elderly or dependent family members.',
      benefits: ['Guardian access', 'Family monitoring', 'Elderly care', 'Dependent support'],
      color: 'from-cyan-500 to-cyan-600',
      status: 'coming-soon'
    },
    {
      id: 'emergency-mode',
      icon: <AlertTriangle className="h-8 w-8" />,
      title: 'Help When You Need It Most',
      description: '24/7 accessibility with emergency mode for quick doctor alerts, nearest hospital info, and instant health vault sharing.',
      benefits: ['24/7 access', 'Emergency alerts', 'Hospital locator', 'Instant sharing'],
      color: 'from-red-500 to-red-600',
      status: 'available'
    },
    {
      id: 'medicine-hub',
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Your Smart Medicine Guide',
      description: 'Comprehensive medicine database with AI explanations covering usage, dosage, side effects, alternatives, and safety warnings.',
      benefits: ['Medicine database', 'AI explanations', 'Safety warnings', 'Alternative options'],
      color: 'from-violet-500 to-violet-600',
      status: 'available'
    },
    {
      id: 'paramedics',
      icon: <Truck className="h-8 w-8" />,
      title: 'Help Closer Than You Think',
      description: 'Location-based service showing nearest paramedics, first aid providers, and ambulance services with real-time booking.',
      benefits: ['Location-based', 'Real-time booking', 'Emergency support', 'Rural coverage'],
      color: 'from-amber-500 to-amber-600',
      status: 'available'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served', icon: <Users className="h-6 w-6" /> },
    { number: '1K+', label: 'Healthcare Providers', icon: <Heart className="h-6 w-6" /> },
    { number: '99.9%', label: 'System Uptime', icon: <Zap className="h-6 w-6" /> },
    { number: '24/7', label: 'AI Support', icon: <Clock className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'MedAI\'s AI assistant helped me understand my symptoms before my doctor visit. The health vault keeps everything organized!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b4e86bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'The platform streamlines patient management and the AI insights help me provide better care. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient',
      content: 'Booking appointments is so easy now, and I love having all my medical records in one secure place.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            <span>Smart Healthcare Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Healthcare,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover how MedAI transforms your healthcare experience with AI-powered insights, 
            seamless doctor connections, and complete health management in one platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Watch Demo
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
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
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

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As a patient, discover all the powerful features designed to make your healthcare journey 
              seamless, informed, and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${feature.color} text-white p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {feature.status === 'available' ? '✅ Available' : '🔒 Coming Soon'}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Key Benefits:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {feature.status === 'available' ? (
                    <Link
                      to="/auth"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                    >
                      <span>Try Now</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MedAI Works for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your complete healthcare journey, simplified and enhanced with AI
            </p>
          </div>

          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white p-4 rounded-full inline-block mb-4 relative">
                  <Users className="h-8 w-8" />
                  <span className="absolute -top-2 -right-2 bg-blue-800 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sign Up & Create Profile</h3>
                <p className="text-sm text-gray-600">Create your secure account and set up your personal health vault</p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white p-4 rounded-full inline-block mb-4 relative">
                  <Brain className="h-8 w-8" />
                  <span className="absolute -top-2 -right-2 bg-green-800 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Chat with AI Assistant</h3>
                <p className="text-sm text-gray-600">Get instant health insights and preliminary guidance 24/7</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white p-4 rounded-full inline-block mb-4 relative">
                  <Calendar className="h-8 w-8" />
                  <span className="absolute -top-2 -right-2 bg-purple-800 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Book Doctor Appointments</h3>
                <p className="text-sm text-gray-600">Connect with verified doctors and schedule consultations easily</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 text-white p-4 rounded-full inline-block mb-4 relative">
                  <Shield className="h-8 w-8" />
                  <span className="absolute -top-2 -right-2 bg-orange-800 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Manage Your Health</h3>
                <p className="text-sm text-gray-600">Track prescriptions, view reports, and monitor your health journey</p>
              </div>
            </div>

            {/* Connecting Lines */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-green-600 via-purple-600 to-orange-600 opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from patients and doctors using MedAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Brain className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Health, Understood by AI
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our advanced AI doesn't just store your data—it understands it. Get personalized insights, 
                trend analysis, and early warning systems that help you stay ahead of health issues.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Symptom analysis with 94% accuracy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Personalized health trend monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Early risk detection and alerts</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-200 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-600 text-white p-2 rounded-full">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Health Analysis</h3>
                      <p className="text-sm text-gray-600">Analyzing your symptoms...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">"I have persistent headaches and feel tired lately"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Based on your symptoms, this could be tension headache. I recommend rest and monitoring. 
                        Would you like me to help you book an appointment with a neurologist?
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Book Appointment</button>
                      <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs">Learn More</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-600 bg-opacity-20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>Enterprise-Grade Security</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Health Data is Safe with Us
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We use bank-level encryption and follow strict healthcare compliance standards 
              to protect your most sensitive information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white p-4 rounded-full inline-block mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">HIPAA Compliant</h3>
              <p className="text-gray-300">
                Full compliance with healthcare privacy regulations and industry standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white p-4 rounded-full inline-block mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
              <p className="text-gray-300">
                Your data is encrypted at rest and in transit, ensuring maximum security.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white p-4 rounded-full inline-block mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Access Control</h3>
              <p className="text-gray-300">
                You control who can access your health data with granular permission settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Healthcare Plans That Work for You
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your healthcare needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Care</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">Free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">AI Health Assistant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Basic Health Vault</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Medicine Database Access</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 text-center block"
              >
                Get Started Free
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Care</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">₹299<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Everything in Basic</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Unlimited Doctor Consultations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Advanced AI Insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Priority Support</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-center block"
              >
                Start Premium Trial
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Family Care</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">₹599<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Everything in Premium</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Up to 6 Family Members</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Guardian Access Controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Emergency Sharing</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 text-center block"
              >
                Protect Your Family
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of patients who trust MedAI for smarter, more accessible healthcare. 
            Start your journey today with our comprehensive health platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Using MedAI Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
              Schedule a Demo
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;