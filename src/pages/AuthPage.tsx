import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Stethoscope, 
  FlaskConical, 
  CreditCard, 
  Settings, 
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  Activity,
  Users,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const roles = [
    {
      id: 'patient',
      title: 'Patients',
      subtitle: 'Your Health, Your Control',
      icon: <Heart className="h-12 w-12" />,
      description: 'Access your medical records, get AI-powered health insights, and manage your healthcare journey with complete control and transparency.',
      status: 'available',
      path: '/user/login',
      color: 'from-emerald-500 via-green-500 to-teal-500',
      glowColor: 'shadow-emerald-500/25',
      features: ['AI Health Assistant', 'Digital Health Vault', 'Smart Appointments', 'Medicine Database'],
      stats: '50K+ Active Patients',
      iconAnimation: 'heartbeat'
    },
    {
      id: 'doctor',
      title: 'Doctors',
      subtitle: 'Empowering Medical Excellence',
      icon: <Stethoscope className="h-12 w-12" />,
      description: 'Manage patients efficiently, leverage AI-assisted diagnosis, and provide exceptional care through our comprehensive doctor portal.',
      status: 'available',
      path: '/doctor/login',
      color: 'from-blue-500 via-indigo-500 to-purple-500',
      glowColor: 'shadow-blue-500/25',
      features: ['Patient Management', 'AI Diagnosis Review', 'Digital Prescriptions', 'Earnings Analytics'],
      stats: '1K+ Verified Doctors',
      iconAnimation: 'bounce'
    },
    {
      id: 'guardian',
      title: 'Guardians',
      subtitle: 'Family Care Simplified',
      icon: <Shield className="h-12 w-12" />,
      description: 'Manage healthcare for family members and dependents with secure access controls and emergency features.',
      status: 'coming-soon',
      path: '#',
      color: 'from-purple-500 via-violet-500 to-indigo-500',
      glowColor: 'shadow-purple-500/25',
      features: ['Family Management', 'Emergency Access', 'Medical Proxy', 'Care Coordination'],
      stats: 'Phase 2 Launch',
      iconAnimation: 'pulse'
    },
    {
      id: 'administrator',
      title: 'Administrators',
      subtitle: 'System Command Center',
      icon: <Settings className="h-12 w-12" />,
      description: 'Comprehensive system administration with advanced analytics, user management, and platform oversight tools.',
      status: 'available',
      path: '/admin/login',
      color: 'from-red-500 via-rose-500 to-pink-500',
      glowColor: 'shadow-red-500/25',
      features: ['User Management', 'System Analytics', 'Security Controls', 'Compliance Tools'],
      stats: 'Enterprise Ready',
      iconAnimation: 'rotate'
    }
  ];

  const handleRoleSelect = (role: any) => {
    if (role.status === 'available') {
      setSelectedRole(role.id);
      // Add a small delay for animation before redirect
      setTimeout(() => {
        window.location.href = role.path;
      }, 300);
    }
  };

  const getIconAnimation = (animationType: string) => {
    switch (animationType) {
      case 'heartbeat':
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'bounce':
        return {
          y: [0, -5, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'pulse':
        return {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'rotate':
        return {
          rotate: [0, 360],
          transition: { duration: 8, repeat: Infinity, ease: "linear" }
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Floating Gradient Blobs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated Heartbeat Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60">
          <motion.div
            className="h-full w-20 bg-gradient-to-r from-emerald-400 to-blue-400"
            animate={{
              x: ['-100px', 'calc(100vw + 100px)'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Medical Icons */}
        <motion.div
          className="absolute top-32 right-32 text-white/10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Activity className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-32 text-white/10"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="h-20 w-20" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center pt-20 pb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Logo with Glow */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Animated Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Choose Your Role to Begin
            <motion.span
              className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Your Healthcare Journey
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Your dashboard adapts to you — whether a Patient, Doctor, Guardian, or Administrator. 
            Experience healthcare reimagined with intelligent insights and seamless coordination.
          </motion.p>

          {/* Floating Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              >
                <Sparkles className="h-4 w-4 text-white/40" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role Selection Grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    y: isLoaded ? 0 : 50,
                    scale: isLoaded ? 1 : 0.9
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2 * index,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 2,
                    rotateX: 2,
                  }}
                  onClick={() => handleRoleSelect(role)}
                  className={`group relative cursor-pointer ${
                    role.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  {/* Glass Card */}
                  <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-500 ${
                    role.status === 'available'
                      ? `hover:bg-white/15 hover:border-white/30 hover:${role.glowColor} hover:shadow-2xl`
                      : 'opacity-75'
                  } ${selectedRole === role.id ? 'ring-4 ring-white/30 bg-white/20' : ''}`}>
                    
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6">
                      {role.status === 'available' ? (
                        <motion.div
                          className="bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-400/30"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ✨ Available Now
                        </motion.div>
                      ) : (
                        <div className="bg-amber-500/20 backdrop-blur-sm text-amber-300 px-4 py-2 rounded-full text-sm font-medium border border-amber-400/30 flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>

                    {/* Animated Icon */}
                    <motion.div
                      className={`bg-gradient-to-r ${role.color} text-white p-6 rounded-2xl inline-block mb-6 relative overflow-hidden`}
                      animate={role.status === 'available' ? getIconAnimation(role.iconAnimation) : {}}
                      whileHover={role.status === 'available' ? { scale: 1.1 } : {}}
                    >
                      {/* Icon Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        {role.icon}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 group-hover:bg-clip-text transition-all duration-500">
                          {role.title}
                        </h3>
                        <p className="text-blue-200 font-medium text-lg">
                          {role.subtitle}
                        </p>
                      </div>

                      <p className="text-blue-100 leading-relaxed text-lg">
                        {role.description}
                      </p>

                      {/* Features Grid */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {role.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center space-x-2 text-sm text-blue-200"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * featureIndex }}
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
                              <span>{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-sm">Platform Stats</span>
                          <span className="text-white font-bold">{role.stats}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {role.status === 'available' ? (
                          <Link
                            to={role.path}
                            className={`group/btn w-full bg-gradient-to-r ${role.color} text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                          >
                            {/* Button Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative z-10">Get Started</span>
                            <motion.div
                              className="relative z-10"
                              animate={{
                                x: [0, 5, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <ArrowRight className="h-5 w-5" />
                            </motion.div>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-gray-600/50 text-gray-300 py-4 px-6 rounded-xl font-semibold cursor-not-allowed backdrop-blur-sm border border-gray-500/30"
                          >
                            Coming Soon
                          </button>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Card Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status Strip */}
        <motion.div
          className="relative bg-black/20 backdrop-blur-xl border-t border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Live Status Ticker */}
              <div className="flex items-center space-x-6 text-sm">
                <motion.div
                  className="flex items-center space-x-2 text-emerald-300"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Patient & Doctor Portals Live</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 text-amber-300"
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Guardian Portal - Phase 2</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 text-blue-300"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Labs & Insurance Integration Coming</span>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-8 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>50K+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Highlight */}
        <motion.div
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white text-center shadow-2xl backdrop-blur-xl border border-white/20">
            <h3 className="text-xl font-bold mb-2">🎉 Currently Available: Patient Portal</h3>
            <p className="text-blue-100 mb-4 max-w-md">
              Start your healthcare journey today with our fully functional patient dashboard. 
              More roles and features launching soon!
            </p>
            <Link
              to="/user/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Access Patient Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;