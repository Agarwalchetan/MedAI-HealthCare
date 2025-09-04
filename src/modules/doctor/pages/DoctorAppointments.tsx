import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Video,
  Phone,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { doctorAPI } from '../services/doctorAPI';
import { Appointment } from '../../../shared/types';
import toast from 'react-hot-toast';

const DoctorAppointments: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTab, setSelectedTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [selectedTab]);

  const fetchAppointments = async () => {
    try {
      let status = '';
      if (selectedTab === 'pending') status = 'pending';
      if (selectedTab === 'confirmed') status = 'confirmed';
      if (selectedTab === 'completed') status = 'completed';

      const response = await doctorAPI.getAppointments(status);
      setAppointments(response.data?.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Mock data for development
      setAppointments([
        {
          _id: '1',
          doctor: 'doctor-id',
          patient: {
            _id: 'patient-1',
            fullName: 'John Smith',
            email: 'john@example.com',
            age: 35,
            gender: 'male',
            phone: '9876543210'
          } as any,
          appointmentDate: new Date(),
          timeSlot: { start: '10:00', end: '11:00' },
          status: 'pending',
          type: 'consultation',
          symptoms: 'Persistent headache and fatigue for the past week',
          notes: '',
          diagnosis: '',
          consultationFee: 500,
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

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  const tabs = [
    { id: 'today', name: 'Today', count: appointments.filter(a => 
      format(new Date(a.appointmentDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length },
    { id: 'pending', name: 'Pending', count: appointments.filter(a => a.status === 'pending').length },
    { id: 'confirmed', name: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length },
    { id: 'completed', name: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'today') {
      return format(new Date(appointment.appointmentDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    }
    return true;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-1">Manage your appointment schedule and consultations</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        selectedTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{tab.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading appointments...</p>
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No Appointments</h3>
                    <p className="text-gray-500">No appointments found for the selected filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment._id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {typeof appointment.patient === 'object' ? appointment.patient.fullName : 'Patient'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} • {appointment.timeSlot.start} - {appointment.timeSlot.end}
                              </p>
                              <p className="text-sm text-gray-500">
                                {appointment.type} • ₹{appointment.consultationFee}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            
                            {appointment.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Accept"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="Reschedule"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              </div>
                            )}

                            {appointment.status === 'confirmed' && (
                              <div className="flex space-x-2">
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Start Video Call"
                                >
                                  <Video className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="Mark Complete"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        {appointment.symptoms && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Symptoms</h4>
                            <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
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

              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">
                        {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.fullName : 'Patient'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">
                        {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.age : 'N/A'} years
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">
                        {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.phone : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium capitalize">
                        {typeof selectedAppointment.patient === 'object' ? selectedAppointment.patient.gender : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(selectedAppointment.appointmentDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">
                        {selectedAppointment.timeSlot.start} - {selectedAppointment.timeSlot.end}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium capitalize">{selectedAppointment.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fee:</span>
                      <span className="ml-2 font-medium">₹{selectedAppointment.consultationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Symptoms</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedAppointment.symptoms}</p>
                  </div>
                </div>

                {/* Diagnosis & Notes */}
                {(selectedAppointment.diagnosis || selectedAppointment.notes) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Consultation Notes</h3>
                    <div className="space-y-3">
                      {selectedAppointment.diagnosis && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Diagnosis</h4>
                          <p className="text-gray-700 text-sm">{selectedAppointment.diagnosis}</p>
                        </div>
                      )}
                      {selectedAppointment.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-gray-700 text-sm">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Accept
                      </button>
                    </>
                  )}
                  
                  {selectedAppointment.status === 'confirmed' && (
                    <>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Video className="h-4 w-4" />
                        <span>Start Video Call</span>
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;