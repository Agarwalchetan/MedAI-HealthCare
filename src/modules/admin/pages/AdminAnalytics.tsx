import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Download,
  Calendar,
  Star,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';

const AdminAnalytics: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  const userGrowthData = [
    { month: 'Jan', patients: 800, doctors: 45, revenue: 450000 },
    { month: 'Feb', patients: 920, doctors: 52, revenue: 520000 },
    { month: 'Mar', patients: 1050, doctors: 61, revenue: 610000 },
    { month: 'Apr', patients: 1180, doctors: 72, revenue: 720000 },
    { month: 'May', patients: 1250, doctors: 85, revenue: 850000 },
    { month: 'Jun', patients: 1320, doctors: 92, revenue: 920000 }
  ];

  const specializationData = [
    { name: 'General Medicine', count: 25, color: '#3B82F6' },
    { name: 'Cardiology', count: 18, color: '#10B981' },
    { name: 'Dermatology', count: 12, color: '#F59E0B' },
    { name: 'Neurology', count: 10, color: '#8B5CF6' },
    { name: 'Orthopedics', count: 8, color: '#EF4444' },
    { name: 'Others', count: 19, color: '#6B7280' }
  ];

  const appointmentTrends = [
    { week: 'Week 1', appointments: 245, completed: 220, cancelled: 15 },
    { week: 'Week 2', appointments: 280, completed: 255, cancelled: 18 },
    { week: 'Week 3', appointments: 320, completed: 295, cancelled: 12 },
    { week: 'Week 4', appointments: 298, completed: 275, cancelled: 10 }
  ];

  const satisfactionData = [
    { rating: '5 Stars', count: 65, color: '#10B981' },
    { rating: '4 Stars', count: 25, color: '#3B82F6' },
    { rating: '3 Stars', count: 8, color: '#F59E0B' },
    { rating: '2 Stars', count: 1.5, color: '#EF4444' },
    { rating: '1 Star', count: 0.5, color: '#6B7280' }
  ];

  const exportReport = async (reportType: string) => {
    try {
      await adminAPI.exportReport(reportType);
      toast.success(`${reportType} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Comprehensive platform analytics and performance metrics</p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <button
                  onClick={() => exportReport('comprehensive')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-5 w-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,320</p>
                    <p className="text-sm text-green-600">+12% this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹9.2L</p>
                    <p className="text-sm text-green-600">+18% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">1,143</p>
                    <p className="text-sm text-green-600">94% completion rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.7</p>
                    <p className="text-sm text-green-600">+0.2 improvement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Platform Growth */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="patients" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="doctors" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Doctor Specializations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Doctor Specializations</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={specializationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                    >
                      {specializationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {specializationData.map((item, index) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Appointment Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#3B82F6" name="Total" />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Patient Satisfaction */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Satisfaction</h2>
                <div className="space-y-4">
                  {satisfactionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < parseInt(item.rating.charAt(0)) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${item.count}%`, 
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{item.count}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Export Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => exportReport('users')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <Users className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">User Report</p>
                    <p className="text-sm text-gray-600">Patient registration & activity</p>
                  </div>
                </button>

                <button
                  onClick={() => exportReport('doctors')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <Activity className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Doctor Report</p>
                    <p className="text-sm text-gray-600">Performance & earnings</p>
                  </div>
                </button>

                <button
                  onClick={() => exportReport('financial')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Financial Report</p>
                    <p className="text-sm text-gray-600">Revenue & transactions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;