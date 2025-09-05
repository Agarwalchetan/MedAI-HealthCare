import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import { Appointment } from '../../../shared/types';
import toast from 'react-hot-toast';

const AdminAppointments: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await adminAPI.getAllAppointments();
      setAppointments(response.data?.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Mock data for development
      setAppointments([
        {
          _id: '1',
          doctor: {
            _id: 'doc1',
            fullName: 'Dr. Sarah Johnson',
            specialization: 'Cardiology'
          } as any,
          patient: {
            _id: 'pat1',
            fullName: 'John Smith',
            email: 'john@example.com'
          } as any,
          appointmentDate: new Date(),
          timeSlot: { start: '10:00', end: '11:00' },
          status: 'confirmed',
          type: 'consultation',
          symptoms: 'Chest pain and shortness of breath',
          notes: '',
          diagnosis: '',
          consultationFee: 800,
          paymentStatus: 'paid',
          meetingLink: '',
          cancelReason: '',
          rating: { score: 0, feedback: '' },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          doctor: {
            _id: 'doc2',
            fullName: 'Dr. Michael Chen',
            specialization: 'Neurology'
          } as any,
          patient: {
            _id: 'pat2',
            fullName: 'Sarah Wilson',
            email: 'sarah@example.com'
          } as any,
          appointmentDate: new Date(),
          timeSlot: { start: '14:00', end: '15:00' },
          status: 'pending',
          type: 'follow-up',
          symptoms: 'Persistent headaches',
          notes: '',
          diagnosis: '',
          consultationFee: 1000,
          paymentStatus: 'pending',
          meetingLink: '',
          cancelReason: '',
          rating: { score: 0, feedback: '' },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const appointmentAnalytics = [
    { day: 'Mon', appointments: 45, completed: 38 },
    { day: 'Tue', appointments: 52, completed: 47 },
    { day: 'Wed', appointments: 38, completed: 35 },
    { day: 'Thu', appointments: 65, completed: 58 },
    { day: 'Fri', appointments: 48, completed: 42 },
    { day: 'Sat', appointments: 29, completed: 26 },
    { day: 'Sun', appointments: 18, completed: 16 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', count: appointments.length },
    { id: 'pending', name: 'Pending Review', count: appointments.filter(a => a.status === 'pending').length },
    { id: 'flagged', name: 'Flagged', count: 0 },
    { id: 'analytics', name: 'Analytics', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const doctorName = typeof appointment.doctor === 'object' ? appointment.doctor.fullName : '';
    const patientName = typeof appointment.patient === 'object' ? appointment.patient.fullName : '';
    
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Appointments & Approvals</h1>
              <p className="text-gray-600 mt-1">Monitor all appointments and manage approval workflows</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {appointments.filter(a => a.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {appointments.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Flagged</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
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
                {activeTab === 'analytics' ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Appointment Trends</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={appointmentAnalytics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="appointments" fill="#3B82F6" name="Total" />
                          <Bar dataKey="completed" fill="#10B981" name="Completed" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-xl p-6 text-center">
                        <h4 className="font-semibold text-gray-900 mb-2">Completion Rate</h4>
                        <p className="text-3xl font-bold text-blue-600">94%</p>
                        <p className="text-sm text-gray-600">This month</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-6 text-center">
                        <h4 className="font-semibold text-gray-900 mb-2">Avg Rating</h4>
                        <p className="text-3xl font-bold text-green-600">4.7</p>
                        <p className="text-sm text-gray-600">Patient satisfaction</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-6 text-center">
                        <h4 className="font-semibold text-gray-900 mb-2">Revenue</h4>
                        <p className="text-3xl font-bold text-purple-600">₹2.4L</p>
                        <p className="text-sm text-gray-600">This month</p>
                      </div>
                    </div>
                  </div>
                ) : (
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
                          placeholder="Search by doctor or patient name..."
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Appointments Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Appointment</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Doctor</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Patient</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Date & Time</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Fee</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((appointment) => (
                            <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                    <Calendar className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">#{appointment._id.slice(-6)}</p>
                                    <p className="text-sm text-gray-600 capitalize">{appointment.type}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {typeof appointment.doctor === 'object' ? appointment.doctor.fullName : 'Doctor'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {typeof appointment.doctor === 'object' ? appointment.doctor.specialization : 'Specialization'}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {typeof appointment.patient === 'object' ? appointment.patient.fullName : 'Patient'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {typeof appointment.patient === 'object' ? appointment.patient.email : 'Email'}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">
                                    {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                                  </p>
                                  <p className="text-gray-600">
                                    {appointment.timeSlot.start} - {appointment.timeSlot.end}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm">
                                  <p className="font-medium text-green-600">₹{appointment.consultationFee}</p>
                                  <p className={`text-xs ${
                                    appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                                  }`}>
                                    {appointment.paymentStatus}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => viewAppointmentDetails(appointment)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {appointment.status === 'pending' && (
                                    <>
                                      <button
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                        title="Approve"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </button>
                                      <button
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        title="Flag"
                                      >
                                        <AlertTriangle className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
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

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Appointment Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Appointment ID:</span>
                        <span className="font-medium font-mono">#{selectedAppointment._id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedAppointment.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {format(new Date(selectedAppointment.appointmentDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {selectedAppointment.timeSlot.start} - {selectedAppointment.timeSlot.end}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-medium text-green-600">₹{selectedAppointment.consultationFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-medium ${
                          selectedAppointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {selectedAppointment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Doctor Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {typeof selectedAppointment.doctor === 'object' ? selectedAppointment.doctor.fullName : 'Doctor'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialization:</span>
                        <span className="font-medium">
                          {typeof selectedAppointment.doctor === 'object' ? selectedAppointment.doctor.specialization : 'Specialization'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Info & Clinical Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.fullName : 'Patient'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.email : 'Email'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Clinical Details</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                        <p className="text-sm text-gray-700">{selectedAppointment.symptoms}</p>
                      </div>
                      {selectedAppointment.diagnosis && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                          <p className="text-sm text-gray-700">{selectedAppointment.diagnosis}</p>
                        </div>
                      )}
                      {selectedAppointment.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                      Flag as Suspicious
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      Approve Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;