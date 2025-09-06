import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Shield, 
  Database, 
  Mail,
  CreditCard,
  Brain,
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import toast from 'react-hot-toast';

interface SystemSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  ai: {
    confidenceThreshold: number;
    enableAutoApproval: boolean;
    maxDailyAnalyses: number;
  };
  payments: {
    platformFeePercentage: number;
    minimumPayout: number;
    payoutFrequency: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
}

const AdminSettings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      platformName: 'MedAI Healthcare Platform',
      supportEmail: 'support@medai.com',
      maintenanceMode: false,
      registrationEnabled: true
    },
    ai: {
      confidenceThreshold: 85,
      enableAutoApproval: false,
      maxDailyAnalyses: 1000
    },
    payments: {
      platformFeePercentage: 10,
      minimumPayout: 1000,
      payoutFrequency: 'weekly'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireTwoFactor: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    }
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSystemSettings();
      if (response.data?.settings) {
        setSettings(response.data.settings);
        reset(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await adminAPI.updateSystemSettings(data);
      setSettings(data);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'ai', name: 'AI Configuration', icon: <Brain className="h-4 w-4" /> },
    { id: 'payments', name: 'Payment Settings', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Mail className="h-4 w-4" /> }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
          <input
            {...register('general.platformName')}
            type="text"
            defaultValue={settings.general.platformName}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
          <input
            {...register('general.supportEmail')}
            type="email"
            defaultValue={settings.general.supportEmail}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
            <p className="text-sm text-gray-600">Temporarily disable platform access for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              {...register('general.maintenanceMode')}
              type="checkbox"
              defaultChecked={settings.general.maintenanceMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">User Registration</h3>
            <p className="text-sm text-gray-600">Allow new users to register on the platform</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              {...register('general.registrationEnabled')}
              type="checkbox"
              defaultChecked={settings.general.registrationEnabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Confidence Threshold (%)
          </label>
          <input
            {...register('ai.confidenceThreshold')}
            type="number"
            min="0"
            max="100"
            defaultValue={settings.ai.confidenceThreshold}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum confidence level for AI diagnoses</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Daily AI Analyses
          </label>
          <input
            {...register('ai.maxDailyAnalyses')}
            type="number"
            min="0"
            defaultValue={settings.ai.maxDailyAnalyses}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum AI analyses per day per user</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Auto-Approval for High Confidence</h3>
          <p className="text-sm text-gray-600">Automatically approve AI diagnoses above threshold</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            {...register('ai.enableAutoApproval')}
            type="checkbox"
            defaultChecked={settings.ai.enableAutoApproval}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Fee Percentage (%)
          </label>
          <input
            {...register('payments.platformFeePercentage')}
            type="number"
            min="0"
            max="50"
            step="0.1"
            defaultValue={settings.payments.platformFeePercentage}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Payout Amount (₹)
          </label>
          <input
            {...register('payments.minimumPayout')}
            type="number"
            min="0"
            defaultValue={settings.payments.minimumPayout}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payout Frequency</label>
          <select
            {...register('payments.payoutFrequency')}
            defaultValue={settings.payments.payoutFrequency}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            {...register('security.sessionTimeout')}
            type="number"
            min="5"
            max="120"
            defaultValue={settings.security.sessionTimeout}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            {...register('security.maxLoginAttempts')}
            type="number"
            min="3"
            max="10"
            defaultValue={settings.security.maxLoginAttempts}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Require Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600">Enforce 2FA for all admin accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            {...register('security.requireTwoFactor')}
            type="checkbox"
            defaultChecked={settings.security.requireTwoFactor}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-600">Send notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              {...register('notifications.emailNotifications')}
              type="checkbox"
              defaultChecked={settings.notifications.emailNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">SMS Notifications</h3>
            <p className="text-sm text-gray-600">Send critical alerts via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              {...register('notifications.smsNotifications')}
              type="checkbox"
              defaultChecked={settings.notifications.smsNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-600">Send real-time push notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              {...register('notifications.pushNotifications')}
              type="checkbox"
              defaultChecked={settings.notifications.pushNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">Configure platform settings and system parameters</p>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-xl shadow-sm">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'general' && renderGeneralSettings()}
                  {activeTab === 'ai' && renderAISettings()}
                  {activeTab === 'payments' && renderPaymentSettings()}
                  {activeTab === 'security' && renderSecuritySettings()}
                  {activeTab === 'notifications' && renderNotificationSettings()}
                </div>

                {/* Save Button */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* System Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Database Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Connected and operational</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Brain className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI Service Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">AI models running normally</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Payment Gateway</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">All payment systems active</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;