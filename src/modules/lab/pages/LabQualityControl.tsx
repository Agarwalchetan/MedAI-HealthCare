import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import LabNavbar from '../components/LabNavbar';
import LabSidebar from '../components/LabSidebar';
import { labAPI, LabRequest } from '../services/labAPI';
import toast from 'react-hot-toast';

const LabManageRequests: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabRequests();
  }, [statusFilter]);

  const fetchLabRequests = async () => {
    try {
      const response = await labAPI.getLabRequests(statusFilter === 'all' ? undefined : statusFilter);
      setRequests(response.data?.requests || []);
    } catch (error) {
      console.error('Error fetching lab requests:', error);
      // Mock data for development
      setRequests([
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
          testsRequested: [
            {
              testName: 'Complete Blood Count',
              testType: 'Blood Test',
              urgency: 'Routine',
              fasting: false,
              estimatedCost: 500
            },
            {
              testName: 'Lipid Profile',
              testType: 'Blood Test',
              urgency: 'Routine',
              fasting: true,
              estimatedCost: 800
            }
          ],
          status: 'Requested',
          priority: 'Medium',
          requestDate: new Date(),
          sampleCollection: {
            method: 'Lab Visit',
            address: '',
            collectionDate: null
          },
          billing: {
            totalAmount: 1300,
            finalAmount: 1300,
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

  const acceptRequest = async (requestId: string) => {
    try {
      const lab = JSON.parse(localStorage.getItem('lab') || '{}');
      await labAPI.assignLabToRequest(requestId, lab._id);
      
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: 'Lab Assigned', lab: lab }
          : req
      ));
      
      toast.success('Lab request accepted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status } : req
      ));
      toast.success(`Request status updated to ${status}`);
    } catch (error: any) {
      toast.error('Failed to update request status');
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

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Lab Requests</h1>
              <p className="text-gray-600 mt-1">Review and process incoming test requests from doctors</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
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
                      {requests.filter(r => r.status === 'Requested').length}
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
                      {requests.filter(r => r.status === 'Processing').length}
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
                      {requests.filter(r => r.status === 'Completed').length}
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
                    placeholder="Search by patient, doctor, or request number..."
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
                    <option value="all">All Requests</option>
                    <option value="Requested">Requested</option>
                    <option value="Lab Assigned">Lab Assigned</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading lab requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Lab Requests</h3>
                  <p className="text-gray-500">Lab requests from doctors will appear here.</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">#{request.requestNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {format(new Date(request.requestDate), 'MMM dd, yyyy • HH:mm')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.patient.fullName}</p>
                              <p className="text-xs text-gray-600">{request.patient.age} years • {request.patient.gender}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.doctor.fullName}</p>
                              <p className="text-xs text-gray-600">{request.doctor.specialization}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Tests Requested ({request.testsRequested.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.testsRequested.map((test, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {test.testName}
                                {test.fasting && <span className="ml-1 text-red-600">*</span>}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Collection: {request.sampleCollection.method}</span>
                            <span className="text-gray-600">
                              Total: ₹{request.billing.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.billing.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.billing.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {request.status === 'Requested' && (
                          <button
                            onClick={() => acceptRequest(request._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Accept Request"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        {['Lab Assigned', 'Sample Collected'].includes(request.status) && (
                          <button
                            onClick={() => updateRequestStatus(request._id, 'Processing')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                            title="Start Processing"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        )}

                        {request.status === 'Processing' && (
                          <button
                            onClick={() => updateRequestStatus(request._id, 'Completed')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="Mark Complete"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lab Request Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Request Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request Number:</span>
                        <span className="font-medium font-mono">{selectedRequest.requestNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request Date:</span>
                        <span className="font-medium">
                          {format(new Date(selectedRequest.requestDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                          {selectedRequest.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedRequest.patient.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedRequest.patient.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">{selectedRequest.patient.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedRequest.patient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Ordering Doctor</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedRequest.doctor.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialization:</span>
                        <span className="font-medium">{selectedRequest.doctor.specialization}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tests and Billing */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Tests Requested</h3>
                    <div className="space-y-3">
                      {selectedRequest.testsRequested.map((test, index) => (
                        <div key={index} className="border border-blue-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{test.testName}</h4>
                            <span className="text-sm text-blue-600 font-medium">₹{test.estimatedCost}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{test.testType}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              test.urgency === 'Emergency' ? 'bg-red-100 text-red-800' :
                              test.urgency === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {test.urgency}
                            </span>
                            {test.fasting && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Fasting Required
                              </span>
                            )}
                          </div>
                          {test.instructions && (
                            <p className="text-xs text-gray-600 mt-2">{test.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Sample Collection</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{selectedRequest.sampleCollection.method}</span>
                      </div>
                      {selectedRequest.sampleCollection.address && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">{selectedRequest.sampleCollection.address}</span>
                        </div>
                      )}
                      {selectedRequest.sampleCollection.collectionDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Collection Date:</span>
                          <span className="font-medium">
                            {format(new Date(selectedRequest.sampleCollection.collectionDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Billing Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">₹{selectedRequest.billing.totalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Amount:</span>
                        <span className="font-medium text-green-600">₹{selectedRequest.billing.finalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedRequest.billing.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedRequest.billing.paymentStatus}
                        </span>
                      </div>
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
                {selectedRequest.status === 'Requested' && (
                  <button
                    onClick={() => acceptRequest(selectedRequest._id)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Accept Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabManageRequests;