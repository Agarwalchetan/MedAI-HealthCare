import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  FileText, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI } from '../services/labAPI';

const LabDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get lab info from localStorage
  const storedLab = localStorage.getItem('lab');
  const lab = storedLab ? JSON.parse(storedLab) : null;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        labAPI.getStats(),
        labAPI.getReports({ limit: 5 })
      ]);

      if (statsResponse.data?.stats) {
        setStats(statsResponse.data.stats);
      }
      if (reportsResponse.data?.reports) {
        setRecentReports(reportsResponse.data.reports);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for development
      setStats({
        totalReports: 1250,
        pendingReports: 45,
        completedReports: 1180,
        todayReports: 28,
        averageTurnaround: 24,
        rating: { average: 4.6, count: 89 },
        totalRevenue: 850000
      });
      setRecentReports([]);
    } finally {
      setLoading(false);
    }
  };

  const reportTrends = [
    { month: 'Jan', reports: 180, completed: 175 },
    { month: 'Feb', reports: 220, completed: 210 },
    { month: 'Mar', reports: 195, completed: 188 },
    { month: 'Apr', reports: 240, completed: 235 },
    { month: 'May', reports: 210, completed: 205 },
    { month: 'Jun', reports: 280, completed: 270 }
  ];

  const testTypeData = [
    { name: 'Blood Tests', value: 45, color: '#3B82F6' },
    { name: 'Urine Tests', value: 25, color: '#10B981' },
    { name: 'Imaging', value: 15, color: '#F59E0B' },
    { name: 'Pathology', value: 10, color: '#8B5CF6' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const turnaroundData = [
    { testType: 'Blood Tests', hours: 12 },
    { testType: 'Urine Tests', hours: 8 },
    { testType: 'X-Ray', hours: 2 },
    { testType: 'MRI', hours: 48 },
    { testType: 'Pathology', hours: 72 }
  ];

  const dashboardStats = [
    {
      title: 'Total Reports',
      value: stats?.totalReports?.toLocaleString() || '0',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+15% this month'
    },
    {
      title: 'Pending Reports',
      value: stats?.pendingReports?.toString() || '0',
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-orange-500',
      change: '12 urgent'
    },
    {
      title: 'Completed Today',
      value: stats?.todayReports?.toString() || '0',
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'bg-green-500',
      change: '+8 from yesterday'
    },
    {
      title: 'Avg Turnaround',
      value: `${stats?.averageTurnaround || 0}h`,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: '2h faster than target'
    }
  ];

  const recentActivity = [
    {
      type: 'report',
      message: 'Blood test report uploaded for John Smith',
      time: '2 hours ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'quality',
      message: 'Quality control completed for 5 reports',
      time: '4 hours ago',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      type: 'urgent',
      message: 'Urgent MRI report delivered',
      time: '6 hours ago',
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <LabSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <LabNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} lab={lab} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {lab?.name}! 🔬
                </h1>
                <p className="text-gray-600">
                  Here's an overview of your laboratory operations and recent activity.
                </p>
              </div>

              {/* Approval Status Alert */}
              {!lab?.isApproved && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-yellow-900">Lab Approval Pending</h3>
                      <p className="text-sm text-yellow-800">
                        Your laboratory credentials are being reviewed. You'll receive approval status within 24-48 hours.
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Report Trends */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Report Trends</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="reports" stroke="#8B5CF6" strokeWidth={3} name="Total Reports" />
                      <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} name="Completed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Test Type Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Type Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={testTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {testTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Distribution']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {testTypeData.map((item, index) => (
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
                {/* Turnaround Times */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Average Turnaround Times</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={turnaroundData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="testType" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} hours`, 'Turnaround Time']} />
                      <Bar dataKey="hours" fill="#8B5CF6" />
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
                          activity.type === 'report' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'quality' ? 'bg-green-100 text-green-600' :
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
                  <button className="w-full mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/lab/upload-report"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Upload Report</h3>
                  <p className="text-sm text-gray-600">Upload new lab reports for patients</p>
                </Link>

                <Link
                  to="/lab/quality-control"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quality Control</h3>
                  <p className="text-sm text-gray-600">Review and approve pending reports</p>
                </Link>

                <Link
                  to="/lab/analytics"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                  <p className="text-sm text-gray-600">Analyze performance metrics</p>
                </Link>
              </div>

              {/* Quality Metrics */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quality Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Avg Turnaround</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats?.averageTurnaround || 0}h</p>
                    <p className="text-sm text-gray-600">Target: 24h</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Report Accuracy</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {lab?.qualityMetrics?.reportAccuracy || 98.5}%
                    </p>
                    <p className="text-sm text-gray-600">Industry standard</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Patient Satisfaction</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {lab?.qualityMetrics?.patientSatisfaction || 4.6}
                    </p>
                    <p className="text-sm text-gray-600">Out of 5.0</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-full inline-block mb-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">On-Time Delivery</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      {lab?.qualityMetrics?.onTimeDelivery || 95.2}%
                    </p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;