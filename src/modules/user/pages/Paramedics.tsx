import React, { useState } from 'react';
import { MapPin, Phone, Star, Navigation, Clock, Truck } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { Paramedic } from '../../../shared/types';

const ParamedicsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedService, setSelectedService] = useState('all');

  const serviceTypes = [
    'all',
    'pharmacy',
    'emergency',
    'home-care',
    'medical-supplies',
    'ambulance'
  ];

  const paramedics: Paramedic[] = [
    {
      id: '1',
      name: 'Apollo Pharmacy',
      location: '123 Main Street, Downtown',
      distance: '0.5 km',
      rating: 4.8,
      phone: '+91-9876543210',
      services: ['pharmacy', 'home-delivery', 'consultation'],
      availability: true,
      emergencyContact: true
    },
    {
      id: '2',
      name: 'MedPlus Health Services',
      location: '456 Healthcare Avenue',
      distance: '1.2 km',
      rating: 4.6,
      phone: '+91-9876543211',
      services: ['pharmacy', 'medical-supplies', 'health-checkup'],
      availability: true,
      emergencyContact: false
    },
    {
      id: '3',
      name: 'Emergency Medical Store',
      location: '789 Emergency Lane',
      distance: '0.8 km',
      rating: 4.9,
      phone: '+91-9876543212',
      services: ['emergency', 'pharmacy', '24x7-service'],
      availability: true,
      emergencyContact: true
    },
    {
      id: '4',
      name: 'Home Care Nursing',
      location: 'Mobile Service - City Wide',
      distance: '2.0 km',
      rating: 4.7,
      phone: '+91-9876543213',
      services: ['home-care', 'nursing', 'physiotherapy'],
      availability: true,
      emergencyContact: false
    },
    {
      id: '5',
      name: 'Quick Ambulance Service',
      location: 'Emergency Response Unit',
      distance: '1.5 km',
      rating: 4.9,
      phone: '+91-9876543214',
      services: ['ambulance', 'emergency', 'trauma-care'],
      availability: true,
      emergencyContact: true
    },
    {
      id: '6',
      name: 'Medical Supply Hub',
      location: '321 Supply District',
      distance: '3.0 km',
      rating: 4.4,
      phone: '+91-9876543215',
      services: ['medical-supplies', 'equipment-rental', 'wholesale'],
      availability: true,
      emergencyContact: false
    }
  ];

  const filteredParamedics = paramedics.filter(paramedic => {
    const matchesLocation = paramedic.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                           paramedic.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesService = selectedService === 'all' || paramedic.services.includes(selectedService);
    return matchesLocation && matchesService;
  });

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'pharmacy': return '💊';
      case 'emergency': return '🚨';
      case 'home-care': return '🏠';
      case 'medical-supplies': return '🏥';
      case 'ambulance': return '🚑';
      default: return '⚕️';
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'pharmacy': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'home-care': return 'bg-green-100 text-green-800';
      case 'medical-supplies': return 'bg-purple-100 text-purple-800';
      case 'ambulance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col md:relative">
        <UserNavbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Paramedics</h1>
            <p className="text-gray-600">Find and contact emergency paramedic services in your area</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search by location or service name..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>
                        {service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Use My Location</span>
                </button>
              </div>
            </div>

            {/* Emergency Banner */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 text-white p-2 rounded-full">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Emergency?</h3>
                  <p className="text-red-800 text-sm">Call 108 for immediate medical assistance or 102 for ambulance services</p>
                </div>
                <div className="ml-auto">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    Call 108
                  </button>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParamedics.map((paramedic) => (
                <div key={paramedic.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{paramedic.name}</h3>
                      <div className="flex items-center space-x-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{paramedic.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{paramedic.rating}</span>
                        </div>
                        <span className="text-gray-500">{paramedic.distance} away</span>
                      </div>
                    </div>
                    {paramedic.emergencyContact && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Emergency
                      </span>
                    )}
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {paramedic.services.map((service, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${getServiceColor(service)}`}
                        >
                          {getServiceIcon(service)} {service.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm font-medium ${
                      paramedic.availability ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {paramedic.availability ? 'Open Now' : 'Closed'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Navigation className="h-4 w-4" />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredParamedics.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-500">Try adjusting your search location or service type.</p>
              </div>
            )}

            {/* Quick Access */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Emergency (108)</p>
                    <p className="text-sm">Medical emergencies</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  <Truck className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Ambulance (102)</p>
                    <p className="text-sm">Patient transport</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200">
                  <MapPin className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Nearest Hospital</p>
                    <p className="text-sm">Find directions</p>
                  </div>
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParamedicsPage;