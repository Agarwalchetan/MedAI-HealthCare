import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  FileText, 
  Bell, 
  TrendingUp,
  Pill,
  FlaskConical,
  Bot,
  MapPin
} from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../../../shared/hooks/useAuth';
import { userAPI } from '../services/userAPI';
import { MedicalHistory, Prescription, LabReport } from '../../../shared/types';

const UserDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [medicalResponse, prescriptionsResponse, labReportsResponse] = await Promise.all([
          userAPI.getMedicalHistory(),
          userAPI.getPrescriptions(),
          userAPI.getLabReports()
        ]);

        setMedicalHistory(medicalResponse.data.medicalHistory || []);
        setPrescriptions(prescriptionsResponse.data.prescriptions || []);
        setLabReports(labReportsResponse.data.labReports || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Medical Records',
      value: medicalHistory.length.toString(),
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Active Prescriptions',
      value: prescriptions.filter(p => p.isActive).length.toString(),
      icon: <Pill className="h-8 w-8" />,
      color: 'bg-green-500',
      change: '3 active'
    },
    {
      title: 'Lab Reports',
      value: labReports.length.toString(),
      icon: <FlaskConical className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: '+1 recent'
    },
    {
      title: 'Health Score',
      value: '85',
      icon: <Activity className="h-8 w-8" />,
      color: 'bg-orange-500',
      change: '+5 improved'
    }
  ];

  const quickActions = [
    {
      title: 'AI Health Checkup',
      description: 'Get instant health insights',
      icon: <Bot className="h-6 w-6" />,
      color: 'bg-blue-600',
      path: '/user/ai-chatbot'
    },
    {
      title: 'Add Medical Record',
      description: 'Record new health information',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-green-600',
      path: '/user/medical-history'
    },
    {
      title: 'Find Paramedics',
      description: 'Locate nearby medical stores',
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-purple-600',
      path: '/user/paramedics'
    },
    {
      title: 'View Lab Reports',
      description: 'Check your latest results',
      icon: <FlaskConical className="h-6 w-6" />,
      color: 'bg-orange-600',
      path: '/user/lab-reports'
    }
  ];

  const recentActivity = [
    {
      type: 'medical',
      message: 'Blood pressure reading recorded',
      time: '2 hours ago',
      icon: <Activity className="h-4 w-4" />
    },
    {
      type: 'prescription',
      message: 'Prescription for Metformin renewed',
      time: '1 day ago',
      icon: <Pill className="h-4 w-4" />
    },
    {
      type: 'lab',
      message: 'Lab report available for Lipid Panel',
      time: '3 days ago',
      icon: <FlaskConical className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      <div className="flex">
        <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600">
                Here's an overview of your health information and recent activity.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <a
                        key={index}
                        href={action.path}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className={`${action.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
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

                {/* Health Insights */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 mt-6 text-white">
                  <h3 className="font-semibold mb-2">Health Insight</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Your health metrics show consistent improvement. Keep up the good work with regular checkups!
                  </p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Health Summary */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Overall Health</h3>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                  <p className="text-sm text-gray-500">Based on recent records</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Health Trend</h3>
                  <p className="text-2xl font-bold text-blue-600">Improving</p>
                  <p className="text-sm text-gray-500">Last 3 months</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Next Checkup</h3>
                  <p className="text-2xl font-bold text-orange-600">30</p>
                  <p className="text-sm text-gray-500">Days remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;