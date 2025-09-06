import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserX, 
  UserCheck,
  Shield,
  Download,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import { User } from '../../../shared/types';
import toast from 'react-hot-toast';

const ManageUsers: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for development
      setUsers([
        {
          _id: '1',
          fullName: 'John Smith',
          email: 'john@example.com',
          role: 'patient',
          age: 35,
          gender: 'male',
          phone: '9876543210',
          healthId: 'HEALTH001',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Jane Smith',
            phone: '9876543211',
            relationship: 'spouse'
          },
          medicalHistory: [],
          prescriptions: [],
          labReports: [],
          insurance: {
            provider: 'Health Insurance Co',
            policyNumber: 'POL123456',
            groupNumber: 'GRP789',
            validUntil: new Date('2025-12-31'),
            coverageAmount: 500000,
            deductible: 5000,
            isActive: true
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          lastLogin: new Date(),
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
        },
        {
          _id: '2',
          fullName: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'patient',
          age: 28,
          gender: 'female',
          phone: '9876543212',
          healthId: 'HEALTH002',
          address: {
            street: '456 Health Ave',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Mike Johnson',
            phone: '9876543213',
            relationship: 'brother'
          },
          medicalHistory: [],
          prescriptions: [],
          labReports: [],
          insurance: {
            provider: 'Care Insurance',
            policyNumber: 'POL789012',
            groupNumber: 'GRP456',
            validUntil: new Date('2025-06-30'),
            coverageAmount: 300000,
            deductible: 3000,
            isActive: true
          },
          isEmailVerified: true,
          isPhoneVerified: false,
          lastLogin: new Date(),
          isActive: true,
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateUserStatus(userId, !currentStatus);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      toast.success(`User ${!currentStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.healthId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive) ||
                         (statusFilter === 'unverified' && (!user.isEmailVerified || !user.isPhoneVerified));
    
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-3xl font-bold text-gray-900">Manage Patients</h1>
                <p className="text-gray-600 mt-1">Monitor and manage patient accounts and health vault access</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="h-5 w-5" />
                <span>Export Data</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.isActive).length}
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
                    <p className="text-sm text-gray-600">Unverified</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => !u.isEmailVerified || !u.isPhoneVerified).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">With Insurance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.insurance?.isActive).length}
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
                    placeholder="Search by name, email, or health ID..."
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
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="inactive">Suspended</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Patient Directory</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading patients...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Patient</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Health ID</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Verification</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-xs text-gray-500">{user.age} years • {user.gender}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm text-gray-900">
                              {user.healthId || 'Not assigned'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-gray-900">{user.phone}</p>
                              <p className="text-gray-600">{user.address?.city}, {user.address?.state}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                Email {user.isEmailVerified ? '✓' : '✗'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                Phone {user.isPhoneVerified ? '✓' : '✗'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => viewUserDetails(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user._id, user.isActive)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  user.isActive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={user.isActive ? 'Suspend User' : 'Activate User'}
                              >
                                {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedUser.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedUser.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">{selectedUser.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Health ID:</span>
                        <span className="font-medium font-mono">{selectedUser.healthId || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
                    <div className="text-sm text-gray-700">
                      <p>{selectedUser.address?.street}</p>
                      <p>{selectedUser.address?.city}, {selectedUser.address?.state} {selectedUser.address?.zipCode}</p>
                      <p>{selectedUser.address?.country}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedUser.emergencyContact?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedUser.emergencyContact?.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relationship:</span>
                        <span className="font-medium capitalize">{selectedUser.emergencyContact?.relationship}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Health Vault Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedUser.medicalHistory?.length || 0}</p>
                        <p className="text-sm text-gray-600">Medical Records</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedUser.prescriptions?.length || 0}</p>
                        <p className="text-sm text-gray-600">Prescriptions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedUser.labReports?.length || 0}</p>
                        <p className="text-sm text-gray-600">Lab Reports</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedUser.insurance?.isActive ? '1' : '0'}
                        </p>
                        <p className="text-sm text-gray-600">Insurance Plans</p>
                      </div>
                    </div>
                  </div>

                  {selectedUser.insurance?.isActive && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Insurance Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium">{selectedUser.insurance.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Policy Number:</span>
                          <span className="font-medium font-mono">{selectedUser.insurance.policyNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coverage:</span>
                          <span className="font-medium">₹{selectedUser.insurance.coverageAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valid Until:</span>
                          <span className="font-medium">
                            {selectedUser.insurance.validUntil ? new Date(selectedUser.insurance.validUntil).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">
                          {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => toggleUserStatus(selectedUser._id, selectedUser.isActive)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedUser.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.isActive ? 'Suspend User' : 'Activate User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;