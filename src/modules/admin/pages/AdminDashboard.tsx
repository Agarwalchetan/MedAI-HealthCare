import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 1250,
    activeDoctors: 85,
    pendingApprovals: 12,
    dailyAppointments: 156
  });
  const [loading, setLoading] = useState(false);

  const userGrowthData = [
    { month: 'Jan', patients: 800, doctors: 45 },
    { month: 'Feb', patients: 920, doctors: 52 },
    { month: 'Mar', patients: 1050, doctors: 61 },
    { month: 'Apr', patients: 1180, doctors: 72 },
    { month: 'May', patients: 1250, doctors: 85 },
    { month: 'Jun', patients: 1320, doctors: 92 }
  ];

  const subscriptionData = [
    { name: 'Free Users', value: 65, color: '#6B7280' },
    { name: 'Basic Plan', value: 25, color: '#3B82F6' },
    { name: 'Pro Plan', value: 8, color: '#10B981' },
    { name: 'Enterprise', value: 2, color: '#F59E0B' }
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 145 },
    { day: 'Tue', appointments: 162 },
    { day: 'Wed', appointments: 138 },
    { day: 'Thu', appointments: 175 },
    { day: 'Fri', appointments: 156 },
    { day: 'Sat', appointments: 89 },
    { day: 'Sun', appointments: 67 }
  ];

  const recentActivity = [
    { type: 'doctor_approval', message: 'Dr. Sarah Johnson approved for Cardiology', time: '2 hours ago', icon: <UserCheck className="h-4 w-4" /> },
    { type: 'user_registration', message: '15 new patients registered today', time: '4 hours ago', icon: <Users className="h-4 w-4" /> },
    { type: 'system_alert', message: 'AI diagnosis accuracy improved to 94%', time: '6 hours ago', icon: <TrendingUp className="h-4 w-4" /> },
    { type: 'approval_pending', message: '3 doctors awaiting verification', time: '8 hours ago', icon: <Clock className="h-4 w-4" /> }
  ];

  const dashboardStats = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      icon: <Users className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+12% this month',
      changeType: 'positive'
    },
    {
      title: 'Active Doctors',
      value: stats.activeDoctors.toString(),
      icon: <UserCheck className="h-8 w-8" />,
      color: 'bg-green-500',
      change: '+8 new this week',
      changeType: 'positive'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-orange-500',
      change: '3 urgent reviews',
      changeType: 'warning'
    },
    {
      title: 'Daily Appointments',
      value: stats.dailyAppointments.toString(),
      icon: <Calendar className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: '+5% from yesterday',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Dashboard 🛡️
                </h1>
                <p className="text-gray-600">
                  Monitor and manage the MedAI healthcare ecosystem
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`${stat.color} text-white p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Growth</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={3} name="Patients" />
                      <Line type="monotone" dataKey="doctors" stroke="#10B981" strokeWidth={3} name="Doctors" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Subscription Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">User Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Users']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {subscriptionData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Appointments */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Appointments</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'doctor_approval' ? 'bg-green-100 text-green-600' :
                          activity.type === 'user_registration' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'system_alert' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Approve Doctors</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Manage Users</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">View Analytics</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">System Alerts</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;