import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, Filter, Plus, Star } from 'lucide-react';
import Calendar as ReactCalendar from 'react-calendar';
import { format } from 'date-fns';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { Doctor, Appointment } from '../../../shared/types';
import toast from 'react-hot-toast';

const AppointmentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(true);

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Surgery'
  ];

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await userAPI.getAppointments();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await userAPI.getAvailableDoctors(selectedSpecialization);
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor) return;
    
    try {
      const response = await userAPI.getAvailableTimeSlots(
        selectedDoctor._id, 
        format(selectedDate, 'yyyy-MM-dd')
      );
      setAvailableSlots(response.data.timeSlots || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleBookAppointment = async (timeSlot: any) => {
    if (!selectedDoctor || !symptoms.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const appointmentData = {
        doctor: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot,
        symptoms,
        consultationFee: selectedDoctor.consultationFee
      };

      await userAPI.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      setSymptoms('');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1">Book and manage your medical appointments</p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* My Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Appointments</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Appointments</h3>
                  <p className="text-gray-500 text-sm">Book your first appointment to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Dr. {typeof appointment.doctor === 'object' ? appointment.doctor.fullName : 'Doctor'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {typeof appointment.doctor === 'object' ? appointment.doctor.specialization : 'Specialization'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} • {appointment.timeSlot.start}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          {appointment.status === 'pending' && (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Doctors */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Doctors</h2>
              
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
                    placeholder="Search doctors by name or specialization..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor._id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="text-center mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-full inline-block mb-3">
                        <User className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating.average.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({doctor.rating.count})</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-medium">{doctor.experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <span className="font-medium text-green-600">₹{doctor.consultationFee}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowBookingModal(true);
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ×
                </button>
              </div>

              {selectedDoctor && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Doctor Info & Calendar */}
                  <div>
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-600 text-white p-3 rounded-full">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedDoctor.fullName}</h3>
                          <p className="text-gray-600">{selectedDoctor.specialization}</p>
                          <p className="text-green-600 font-medium">₹{selectedDoctor.consultationFee}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Select Date</h3>
                      <ReactCalendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                        className="w-full border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Time Slots & Booking */}
                  <div>
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Available Slots - {format(selectedDate, 'MMM dd, yyyy')}
                      </h3>
                      
                      {availableSlots.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No slots available for this date</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => handleBookAppointment(slot)}
                              className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
                            >
                              <div className="font-medium text-gray-900">{slot.start}</div>
                              <div className="text-sm text-gray-500">Available</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your symptoms
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={4}
                        placeholder="Please describe your symptoms and concerns..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;