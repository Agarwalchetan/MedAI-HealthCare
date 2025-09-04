import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  PieChart,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { Earnings } from '../../../shared/types';

const DoctorEarnings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [subscriptionPlan, setSubscriptionPlan] = useState('pro');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [selectedMonth, selectedYear]);

  const fetchEarnings = async () => {
    try {
      const response = await doctorAPI.getEarnings(selectedMonth, selectedYear);
      setEarnings(response.data?.earnings || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      // Mock data for development
      setEarnings([
        {
          _id: '1',
          doctor: 'doctor-id',
          appointment: 'appointment-1',
          patient: 'patient-1',
          amount: 500,
          platformFee: 50,
          netAmount: 450,
          paymentMethod: 'card',
          transactionId: 'TXN123456',
          status: 'completed',
          payoutStatus: 'processed',
          payoutDate: new Date(),
          month: selectedMonth,
          year: selectedYear,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  const totalConsultations = earnings.length;
  const averagePerConsultation = totalConsultations > 0 ? totalEarnings / totalConsultations : 0;

  const monthlyData = [
    { month: 'Jan', earnings: 45000, consultations: 90 },
    { month: 'Feb', earnings: 52000, consultations: 104 },
    { month: 'Mar', earnings: 48000, consultations: 96 },
    { month: 'Apr', earnings: 61000, consultations: 122 },
    { month: 'May', earnings: 55000, consultations: 110 },
    { month: 'Jun', earnings: 67000, consultations: 134 },
  ];

  const paymentMethodData = [
    { name: 'Card', value: 65, color: '#3B82F6' },
    { name: 'UPI', value: 25, color: '#10B981' },
    { name: 'Wallet', value: 8, color: '#F59E0B' },
    { name: 'Cash', value: 2, color: '#6B7280' }
  ];

  const subscriptionPlans = {
    basic: { name: 'Basic', fee: 0, features: ['Basic dashboard', 'Up to 50 patients'] },
    pro: { name: 'Pro', fee: 999, features: ['Advanced analytics', 'Unlimited patients', 'AI assistance'] },
    enterprise: { name: 'Enterprise', fee: 2999, features: ['Custom integrations', 'Priority support', 'Advanced AI'] }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2025];

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Earnings & Subscriptions</h1>
                <p className="text-gray-600 mt-1">Track your earnings and manage subscription</p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Earnings Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">{totalConsultations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg per Consultation</p>
                    <p className="text-2xl font-bold text-gray-900">₹{Math.round(averagePerConsultation)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Payout</p>
                    <p className="text-2xl font-bold text-gray-900">₹{(totalEarnings * 0.1).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Earnings Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Earnings Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                    <Bar dataKey="earnings" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {paymentMethodData.map((method, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: method.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(subscriptionPlans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                      subscriptionPlan === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        ₹{plan.fee}
                        <span className="text-sm text-gray-500 font-normal">/month</span>
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 ${
                        subscriptionPlan === key
                          ? 'bg-blue-600 text-white'
                          : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {subscriptionPlan === key ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                  <Download className="h-4 w-4" />
                  <span>Download Invoice</span>
                </button>
              </div>

              {earnings.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Transactions</h3>
                  <p className="text-gray-500 text-sm">Earnings will appear here once you complete consultations.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Platform Fee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Net Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((earning) => (
                        <tr key={earning._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {typeof earning.patient === 'object' ? earning.patient.fullName : 'Patient'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">₹{earning.amount}</td>
                          <td className="py-3 px-4 text-sm text-red-600">-₹{earning.platformFee}</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">₹{earning.netAmount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              earning.status === 'completed' ? 'bg-green-100 text-green-800' :
                              earning.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {earning.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorEarnings;