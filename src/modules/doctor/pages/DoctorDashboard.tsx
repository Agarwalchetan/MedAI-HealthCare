import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Pill, 
  DollarSign, 
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link, Navigate } from 'react-router-dom';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { useAuth } from '../../../shared/hooks/useAuth';
import { DoctorStats, Appointment } from '../../../shared/types';

const DoctorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { doctor: authDoctor } = useAuth();

  // Check if doctor is authenticated
  const storedDoctor = localStorage.getItem('doctor');
  const doctor = authDoctor || (storedDoctor ? JSON.parse(storedDoctor) : null);

  console.log('DoctorDashboard - authDoctor:', authDoctor, 'storedDoctor:', storedDoctor, 'final doctor:', doctor);

  // Redirect to login if no doctor authentication
  if (!doctor && !loading) {
    console.log('No doctor authentication found, redirecting to login');
    return <Navigate to="/doctor/login" replace />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        doctorAPI.getStats(),
        doctorAPI.getAppointments('pending')
      ]);
      
      if (statsResponse.data?.stats) {
        setStats(statsResponse.data.stats);
      }
      if (appointmentsResponse.data?.appointments) {
        setTodayAppointments(appointmentsResponse.data.appointments.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for development
      setStats({
        totalPatients: 150,
        totalAppointments: 45,
        completedAppointments: 38,
        todayAppointments: 5,
        totalPrescriptions: 120,
        totalEarnings: 75000,
        rating: { average: 4.8, count: 95 }
      });
      setTodayAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const earningsData = [
    { month: 'Jan', earnings: 45000 },
    { month: 'Feb', earnings: 52000 },
    { month: 'Mar', earnings: 48000 },
    { month: 'Apr', earnings: 61000 },
    { month: 'May', earnings: 55000 },
    { month: 'Jun', earnings: 67000 },
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 8 },
    { day: 'Tue', appointments: 12 },
    { day: 'Wed', appointments: 6 },
    { day: 'Thu', appointments: 15 },
    { day: 'Fri', appointments: 10 },
    { day: 'Sat', appointments: 4 },
    { day: 'Sun', appointments: 2 },
  ];

  const dashboardStats = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients?.toString() || '0',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+12 this month'
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.todayAppointments?.toString() || '0',
      icon: <Calendar className="h-8 w-8" />,
      color: 'bg-green-500',
      change: '3 pending'
    },
    {
      title: 'Total Prescriptions',
      value: stats?.totalPrescriptions?.toString() || '0',
      icon: <Pill className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: '+8 this week'
    },
    {
      title: 'Monthly Earnings',
      value: `₹${stats?.totalEarnings?.toLocaleString() || '0'}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-orange-500',
      change: '+15% from last month'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} doctor={doctor} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Dr. {doctor?.fullName?.split(' ')[1] || 'Doctor'}! 👨‍⚕️
                </h1>
                <p className="text-gray-600">
                  Here's an overview of your practice and today's schedule.
                </p>
              </div>

              {/* Verification Alert */}
              {!doctor?.isVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-yellow-900">Account Verification Pending</h3>
                      <p className="text-sm text-yellow-800">
                        Your medical credentials are being reviewed. You'll receive verification status within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-green-600 text-sm mt-1">{stat.change}</p>
                      </div>
                      <div className={`${stat.color} text-white p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earnings Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Earnings</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Line type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Weekly Appointments */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Appointments</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                  <Link
                    to="/doctor/appointments"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>

                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No Appointments Today</h3>
                    <p className="text-gray-500 text-sm">You have a free schedule today!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {typeof appointment.patient === 'object' ? appointment.patient.fullName : 'Patient'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.timeSlot.start} - {appointment.timeSlot.end}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/doctor/appointments"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Manage Appointments</h3>
                  <p className="text-sm text-gray-600">View and manage your schedule</p>
                </Link>

                <Link
                  to="/doctor/prescriptions"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Write Prescription</h3>
                  <p className="text-sm text-gray-600">Create digital prescriptions</p>
                </Link>

                <Link
                  to="/doctor/patients"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Patient Records</h3>
                  <p className="text-sm text-gray-600">Access patient health vaults</p>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;