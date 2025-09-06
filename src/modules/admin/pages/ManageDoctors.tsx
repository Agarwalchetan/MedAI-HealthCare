import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { adminAPI } from '../services/adminAPI';
import { Doctor } from '../../../shared/types';
import toast from 'react-hot-toast';

const ManageDoctors: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const specializations = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Surgery', 'Gynecology', 'Ophthalmology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const [doctorsResponse, pendingResponse] = await Promise.all([
        adminAPI.getDoctors(),
        adminAPI.getPendingDoctors()
      ]);
      
      setDoctors(doctorsResponse.data?.doctors || []);
      setPendingDoctors(pendingResponse.data?.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Mock data for development
      const mockDoctors: Doctor[] = [
        {
          _id: '1',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@example.com',
          specialization: 'Cardiology',
          licenseNumber: 'MD123456',
          experience: 12,
          qualifications: [
            { degree: 'MBBS', institution: 'Harvard Medical School', year: 2008 },
            { degree: 'MD Cardiology', institution: 'Johns Hopkins', year: 2012 }
          ],
          phone: '9876543210',
          address: {
            street: '123 Medical Center',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          clinicDetails: {
            name: 'Heart Care Clinic',
            address: '123 Medical Center, Mumbai',
            phone: '9876543210',
            timings: {
              start: '09:00',
              end: '17:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
          },
          consultationFee: 800,
          isVerified: true,
          isActive: true,
          rating: { average: 4.8, count: 156 },
          totalPatients: 450,
          totalEarnings: 360000,
          subscriptionPlan: 'pro',
          subscriptionExpiry: new Date('2025-12-31'),
          profilePicture: '',
          availability: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '09:00', end: '13:00', available: true },
            sunday: { start: '00:00', end: '00:00', available: false }
          },
          lastLogin: new Date(),
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date()
        }
      ];

      const mockPendingDoctors: Doctor[] = [
        {
          _id: '2',
          fullName: 'Dr. Michael Chen',
          email: 'michael.chen@example.com',
          specialization: 'Neurology',
          licenseNumber: 'MD789012',
          experience: 8,
          qualifications: [
            { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2012 },
            { degree: 'MD Neurology', institution: 'PGIMER Chandigarh', year: 2016 }
          ],
          phone: '9876543211',
          address: {
            street: '456 Neuro Center',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          },
          clinicDetails: {
            name: 'Brain Health Clinic',
            address: '456 Neuro Center, Delhi',
            phone: '9876543211',
            timings: {
              start: '10:00',
              end: '18:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            }
          },
          consultationFee: 1000,
          isVerified: false,
          isActive: false,
          rating: { average: 0, count: 0 },
          totalPatients: 0,
          totalEarnings: 0,
          subscriptionPlan: 'basic',
          subscriptionExpiry: new Date('2025-12-31'),
          profilePicture: '',
          availability: {
            monday: { start: '10:00', end: '18:00', available: true },
            tuesday: { start: '10:00', end: '18:00', available: true },
            wednesday: { start: '10:00', end: '18:00', available: true },
            thursday: { start: '10:00', end: '18:00', available: true },
            friday: { start: '10:00', end: '18:00', available: true },
            saturday: { start: '10:00', end: '14:00', available: true },
            sunday: { start: '00:00', end: '00:00', available: false }
          },
          lastLogin: new Date(),
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date()
        }
      ];

      setDoctors(mockDoctors);
      setPendingDoctors(mockPendingDoctors);
    } finally {
      setLoading(false);
    }
  };

  const approveDoctorRegistration = async (doctorId: string, approved: boolean, comments?: string) => {
    try {
      await adminAPI.approveDoctorRegistration(doctorId, approved, comments);
      
      if (approved) {
        // Move from pending to approved
        const approvedDoctor = pendingDoctors.find(d => d._id === doctorId);
        if (approvedDoctor) {
          setDoctors(prev => [...prev, { ...approvedDoctor, isVerified: true, isActive: true }]);
          setPendingDoctors(prev => prev.filter(d => d._id !== doctorId));
        }
        toast.success('Doctor approved successfully');
      } else {
        setPendingDoctors(prev => prev.filter(d => d._id !== doctorId));
        toast.success('Doctor registration rejected');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process approval');
    }
  };

  const toggleDoctorStatus = async (doctorId: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateDoctorStatus(doctorId, !currentStatus);
      setDoctors(prev => prev.map(doctor => 
        doctor._id === doctorId ? { ...doctor, isActive: !currentStatus } : doctor
      ));
      toast.success(`Doctor ${!currentStatus ? 'activated' : 'suspended'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update doctor status');
    }
  };

  const viewDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const tabs = [
    { id: 'pending', name: 'Pending Approval', count: pendingDoctors.length },
    { id: 'approved', name: 'Approved Doctors', count: doctors.length },
    { id: 'analytics', name: 'Doctor Analytics', count: 0 }
  ];

  const currentDoctors = activeTab === 'pending' ? pendingDoctors : doctors;
  
  const filteredDoctors = currentDoctors.filter(doctor => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
                <p className="text-gray-600 mt-1">Review doctor applications and manage verified practitioners</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="h-5 w-5" />
                <span>Export Report</span>
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
                {activeTab !== 'analytics' && (
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
                          placeholder="Search by name, email, or license number..."
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          value={specializationFilter}
                          onChange={(e) => setSpecializationFilter(e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Specializations</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Doctors Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Doctor</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Specialization</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">License</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Experience</th>
                            {activeTab === 'approved' && (
                              <>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Rating</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Earnings</th>
                              </>
                            )}
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDoctors.map((doctor) => (
                            <tr key={doctor._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                    <UserCheck className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{doctor.fullName}</p>
                                    <p className="text-sm text-gray-600">{doctor.email}</p>
                                    <p className="text-xs text-gray-500">{doctor.phone}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm font-medium text-gray-900">{doctor.specialization}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-mono text-sm text-gray-900">{doctor.licenseNumber}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm text-gray-900">{doctor.experience} years</span>
                              </td>
                              {activeTab === 'approved' && (
                                <>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-medium">{doctor.rating.average.toFixed(1)}</span>
                                      <span className="text-xs text-gray-500">({doctor.rating.count})</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className="text-sm font-medium text-green-600">
                                      ₹{doctor.totalEarnings.toLocaleString()}
                                    </span>
                                  </td>
                                </>
                              )}
                              <td className="py-4 px-6">
                                {activeTab === 'pending' ? (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    Pending Review
                                  </span>
                                ) : (
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {doctor.isActive ? 'Active' : 'Suspended'}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => viewDoctorDetails(doctor)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {activeTab === 'pending' ? (
                                    <>
                                      <button
                                        onClick={() => approveDoctorRegistration(doctor._id, true)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                        title="Approve"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => approveDoctorRegistration(doctor._id, false)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        title="Reject"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => toggleDoctorStatus(doctor._id, doctor.isActive)}
                                      className={`p-2 rounded-lg transition-colors duration-200 ${
                                        doctor.isActive 
                                          ? 'text-red-600 hover:bg-red-50' 
                                          : 'text-green-600 hover:bg-green-50'
                                      }`}
                                      title={doctor.isActive ? 'Suspend' : 'Activate'}
                                    >
                                      {doctor.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                    </button>
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

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-xl p-6 text-center">
                        <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
                          <UserCheck className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Total Doctors</h3>
                        <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-6 text-center">
                        <div className="bg-green-600 text-white p-3 rounded-full inline-block mb-3">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Total Earnings</h3>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{doctors.reduce((sum, d) => sum + d.totalEarnings, 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-6 text-center">
                        <div className="bg-purple-600 text-white p-3 rounded-full inline-block mb-3">
                          <Star className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Avg Rating</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {doctors.length > 0 
                            ? (doctors.reduce((sum, d) => sum + d.rating.average, 0) / doctors.length).toFixed(1)
                            : '0.0'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Doctors</h3>
                      <div className="space-y-4">
                        {doctors
                          .sort((a, b) => b.rating.average - a.rating.average)
                          .slice(0, 5)
                          .map((doctor, index) => (
                            <div key={doctor._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                                <div>
                                  <p className="font-medium text-gray-900">{doctor.fullName}</p>
                                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Rating</p>
                                  <p className="font-bold text-yellow-600">{doctor.rating.average.toFixed(1)}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Patients</p>
                                  <p className="font-bold text-blue-600">{doctor.totalPatients}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Earnings</p>
                                  <p className="font-bold text-green-600">₹{doctor.totalEarnings.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Doctor Details Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal & Professional Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedDoctor.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedDoctor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedDoctor.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">License Number:</span>
                        <span className="font-medium font-mono">{selectedDoctor.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{selectedDoctor.experience} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Qualifications</h3>
                    <div className="space-y-3">
                      {selectedDoctor.qualifications.map((qual, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <p className="font-medium text-gray-900">{qual.degree}</p>
                          <p className="text-sm text-gray-600">{qual.institution}</p>
                          <p className="text-xs text-gray-500">Year: {qual.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clinic & Performance Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Clinic Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clinic Name:</span>
                        <span className="font-medium">{selectedDoctor.clinicDetails?.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right">{selectedDoctor.clinicDetails?.address || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-medium text-green-600">₹{selectedDoctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  {selectedDoctor.isVerified && (
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{selectedDoctor.totalPatients}</p>
                          <p className="text-sm text-gray-600">Total Patients</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {selectedDoctor.rating.average.toFixed(1)}
                          </p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            ₹{selectedDoctor.totalEarnings.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">Total Earnings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{selectedDoctor.subscriptionPlan}</p>
                          <p className="text-sm text-gray-600">Plan</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Verification Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedDoctor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedDoctor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedDoctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedDoctor.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">
                          {new Date(selectedDoctor.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                {!selectedDoctor.isVerified ? (
                  <>
                    <button
                      onClick={() => approveDoctorRegistration(selectedDoctor._id, false)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => approveDoctorRegistration(selectedDoctor._id, true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Approve Doctor
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleDoctorStatus(selectedDoctor._id, selectedDoctor.isActive)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedDoctor.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedDoctor.isActive ? 'Suspend Doctor' : 'Activate Doctor'}
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

export default ManageDoctors;