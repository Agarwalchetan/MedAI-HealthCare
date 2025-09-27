import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  User,
  Stethoscope,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI, LabRequest } from '../services/labAPI';

const LabRequests: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allRequests, setAllRequests] = useState<LabRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllLabRequests();
  }, [statusFilter]);

  const fetchAllLabRequests = async () => {
    try {
      const response = await labAPI.getAllLabRequests(statusFilter === 'all' ? undefined : statusFilter);
      setAllRequests(response.data?.requests || []);
    } catch (error) {
      console.error('Error fetching all lab requests:', error);
      // Mock data for development
      setAllRequests([
        {
          _id: '1',
          requestNumber: 'REQ20250115001',
          patient: {
            _id: 'patient-1',
            fullName: 'John Smith',
            email: 'john@example.com',
            age: 35,
            gender: 'male'
          },
          doctor: {
            _id: 'doctor-1',
            fullName: 'Dr. Sarah Johnson',
            specialization: 'Cardiology'
          },
          lab: {
            _id: 'lab-1',
            name: 'City Diagnostic Center',
            contactInfo: { phone: '9876543210' }
          },
          testsRequested: [
            {
              testName: 'Complete Blood Count',
              testType: 'Blood Test',
              urgency: 'Routine',
              fasting: false,
              estimatedCost: 500
            }
          ],
          status: 'Lab Assigned',
          priority: 'Medium',
          requestDate: new Date(),
          sampleCollection: {
            method: 'Lab Visit',
            address: '',
            collectionDate: null
          },
          billing: {
            totalAmount: 500,
            finalAmount: 500,
            paymentStatus: 'Paid'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          requestNumber: 'REQ20250115002',
          patient: {
            _id: 'patient-2',
            fullName: 'Sarah Wilson',
            email: 'sarah@example.com',
            age: 28,
            gender: 'female'
          },
          doctor: {
            _id: 'doctor-2',
            fullName: 'Dr. Michael Chen',
            specialization: 'Neurology'
          },
          testsRequested: [
            {
              testName: 'MRI Brain',
              testType: 'MRI',
              urgency: 'Urgent',
              fasting: false,
              estimatedCost: 8000
            }
          ],
          status: 'Requested',
          priority: 'High',
          requestDate: new Date(),
          sampleCollection: {
            method: 'Hospital',
            address: 'City Hospital, Room 205',
            collectionDate: null
          },
          billing: {
            totalAmount: 8000,
            finalAmount: 8000,
            paymentStatus: 'Pending'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested': return 'bg-yellow-100 text-yellow-800';
      case 'Lab Assigned': return 'bg-blue-100 text-blue-800';
      case 'Sample Collected': return 'bg-purple-100 text-purple-800';
      case 'Processing': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = request.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.lab?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <LabSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <LabNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">All Lab Requests</h1>
              <p className="text-gray-600 mt-1">Monitor all lab requests across the platform</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{allRequests.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allRequests.filter(r => r.status === 'Requested').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allRequests.filter(r => r.status === 'Lab Assigned').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allRequests.filter(r => r.status === 'Processing').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allRequests.filter(r => r.status === 'Completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by patient, doctor, lab, or request number..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Requested">Requested</option>
                    <option value="Lab Assigned">Lab Assigned</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lab Requests Overview</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading lab requests...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Request</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Patient</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Doctor</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Lab</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Tests</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">#{request.requestNumber}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                  {request.priority}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{request.patient.fullName}</p>
                              <p className="text-sm text-gray-600">{request.patient.age} years • {request.patient.gender}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{request.doctor.fullName}</p>
                              <p className="text-sm text-gray-600">{request.doctor.specialization}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{request.lab?.name || 'Unassigned'}</p>
                              {request.lab?.contactInfo?.phone && (
                                <p className="text-sm text-gray-600">{request.lab.contactInfo.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              {request.testsRequested.slice(0, 2).map((test, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium text-gray-900">{test.testName}</span>
                                  {test.fasting && <span className="text-red-600 ml-1">*</span>}
                                </div>
                              ))}
                              {request.testsRequested.length > 2 && (
                                <p className="text-xs text-gray-500">+{request.testsRequested.length - 2} more</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="font-medium text-green-600">₹{request.billing.totalAmount?.toLocaleString()}</p>
                              <p className={`text-xs ${
                                request.billing.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {request.billing.paymentStatus}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {format(new Date(request.requestDate), 'MMM dd')}
                              </p>
                              <p className="text-gray-600">
                                {format(new Date(request.requestDate), 'HH:mm')}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredRequests.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Lab Requests Found</h3>
                  <p className="text-gray-500">No lab requests match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabRequests;