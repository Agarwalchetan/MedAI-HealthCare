import React, { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, Clock, User } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { Prescription } from '../../../shared/types';
import toast from 'react-hot-toast';

const PrescriptionsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await userAPI.getPrescriptions();
      setPrescriptions(response.data?.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (filter === 'active') return prescription.isActive;
    if (filter === 'completed') return !prescription.isActive;
    return true;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // Sample prescriptions for demonstration
  const samplePrescriptions: Prescription[] = [
    {
      _id: '1',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date('2024-01-15'),
      instructions: 'Take with food. Monitor blood pressure regularly.',
      isActive: true
    },
    {
      _id: '2',
      medicationName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: new Date('2024-01-10'),
      instructions: 'Take with meals to reduce stomach upset.',
      isActive: true
    },
    {
      _id: '3',
      medicationName: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Three times daily',
      duration: '10 days',
      prescribedBy: 'Dr. Emily Rodriguez',
      prescribedDate: new Date('2023-12-20'),
      instructions: 'Complete the full course even if symptoms improve.',
      isActive: false
    }
  ];

  const displayPrescriptions = prescriptions.length > 0 ? filteredPrescriptions : samplePrescriptions.filter(prescription => {
    if (filter === 'active') return prescription.isActive;
    if (filter === 'completed') return !prescription.isActive;
    return true;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                <p className="text-gray-600 mt-1">Manage your medications and prescriptions</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="h-5 w-5" />
                <span>Add Prescription</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-1 mb-6 inline-flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                All ({prescriptions.length > 0 ? prescriptions.length : samplePrescriptions.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Active ({prescriptions.length > 0 ? prescriptions.filter(p => p.isActive).length : samplePrescriptions.filter(p => p.isActive).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Completed ({prescriptions.length > 0 ? prescriptions.filter(p => !p.isActive).length : samplePrescriptions.filter(p => !p.isActive).length})
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading prescriptions...</p>
                </div>
              ) : displayPrescriptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
                  <p className="text-gray-500 mb-6">You don't have any prescriptions matching the selected filter.</p>
                  <button className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Plus className="h-5 w-5" />
                    <span>Add Prescription</span>
                  </button>
                </div>
              ) : (
                displayPrescriptions.map((prescription) => (
                  <div key={prescription._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{prescription.medicationName}</h3>
                            <p className="text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.isActive)}`}>
                            {prescription.isActive ? 'Active' : 'Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Duration: {prescription.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="text-sm">By: {prescription.prescribedBy}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {prescription.instructions && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <h4 className="font-medium text-blue-900 mb-1">Instructions</h4>
                            <p className="text-blue-800 text-sm">{prescription.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Cards */}
            {displayPrescriptions.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full inline-block mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Active Medications</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {displayPrescriptions.filter(p => p.isActive).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-block mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">This Month</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {displayPrescriptions.filter(p => 
                      new Date(p.prescribedDate).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full inline-block mb-3">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Doctors</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(displayPrescriptions.map(p => p.prescribedBy)).size}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescriptionsPage;