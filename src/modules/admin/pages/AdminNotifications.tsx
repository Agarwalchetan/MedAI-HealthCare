import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Search,
  Filter,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SystemLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

const AdminNotifications: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchSystemLogs();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await adminAPI.getNotifications();
      setNotifications(response.data?.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock data for development
      setNotifications([
        {
          id: '1',
          type: 'warning',
          title: 'Doctor Verification Pending',
          message: 'Dr. Michael Chen has submitted documents for verification. Review required.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'success',
          title: 'System Backup Completed',
          message: 'Daily system backup completed successfully at 2:00 AM.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: true,
          priority: 'low'
        },
        {
          id: '3',
          type: 'error',
          title: 'Payment Gateway Error',
          message: 'Payment processing failed for 3 transactions. Immediate attention required.',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          read: false,
          priority: 'high'
        },
        {
          id: '4',
          type: 'info',
          title: 'New User Registrations',
          message: '25 new patients registered in the last 24 hours.',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: true,
          priority: 'medium'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await adminAPI.getSystemLogs();
      setSystemLogs(response.data?.logs || []);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      // Mock data for development
      setSystemLogs([
        {
          id: '1',
          action: 'Doctor Approved',
          user: 'admin@medai.com',
          details: 'Approved Dr. Sarah Johnson for Cardiology practice',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          action: 'User Suspended',
          user: 'admin@medai.com',
          details: 'Suspended user account for policy violation',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '3',
          action: 'System Settings Updated',
          user: 'admin@medai.com',
          details: 'Updated AI diagnosis confidence threshold to 85%',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      ]);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      case 'success': return <CheckCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-600 border-red-200';
      case 'success': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const tabs = [
    { id: 'notifications', name: 'Notifications', count: notifications.filter(n => !n.read).length },
    { id: 'logs', name: 'System Logs', count: systemLogs.length }
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">Notifications & System Logs</h1>
                <p className="text-gray-600 mt-1">Monitor system alerts and audit trail</p>
              </div>
              <button
                onClick={() => exportReport('logs')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="h-5 w-5" />
                <span>Export Logs</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{tab.name}</span>
                      {tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'notifications' ? (
                  <>
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search notifications..."
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Types</option>
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                          <option value="success">Success</option>
                        </select>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 transition-all duration-200 ${
                            notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
                          } ${getNotificationColor(notification.type)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                    {notification.priority}
                                  </span>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                                <p className="text-xs text-gray-500">
                                  {notification.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="Mark as Read"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* System Logs */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">System Audit Logs</h2>
                      <p className="text-gray-600 text-sm">All administrative actions are logged for security and compliance.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Timestamp</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Action</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Details</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {systemLogs.map((log) => (
                            <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">
                                    {log.timestamp.toLocaleDateString()}
                                  </p>
                                  <p className="text-gray-600">
                                    {log.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm font-medium text-gray-900">{log.user}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm text-gray-700">{log.details}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm font-mono text-gray-600">{log.ipAddress}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNotifications;