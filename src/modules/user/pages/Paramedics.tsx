import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Navigation, Clock, Truck, AlertCircle, Loader2 } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { Paramedic } from '../../../shared/types';
import {
  getCurrentLocation,
  searchNearbyHospitals,
  searchHospitalsByText,
  getDirectionsUrl,
  makePhoneCall
} from './paramedics/GoogleMaps';

const ParamedicsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [paramedics, setParamedics] = useState<Paramedic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km radius

  const serviceTypes = [
    'all',
    'hospital',
    'pharmacy',
    'emergency',
    'consultation',
    'health-checkup',
    'dental',
    'home-care',
    'medical-supplies',
    'ambulance',
    'specialist',
    'physiotherapy',
    'nursing'
  ];

  // Check API configuration on mount but don't load hospitals automatically
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const isConfigured = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE';

    if (!isConfigured) {
      setError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
    }
  }, []);

  const loadNearbyHospitals = async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setLocationPermission('granted');

      const nearbyHospitals = await searchNearbyHospitals(location, searchRadius * 1000); // in meters
      setParamedics(nearbyHospitals);
    } catch (err) {
      console.error('Error loading hospitals:', err);
      if (err instanceof Error && err.message.includes('denied')) {
        setLocationPermission('denied');
        setError('Location access denied. Please enable location services and refresh the page.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load nearby hospitals. Please check your API configuration.');
      }
      setParamedics([]);
    } finally {
      setLoading(false);
    }
  };


  const handleUseMyLocation = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await loadNearbyHospitals();
  };

  const handleSearch = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!searchLocation.trim() || !userLocation) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchHospitalsByText(searchLocation, userLocation, searchRadius * 1000);
      setParamedics(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please check your API configuration.');
      setParamedics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    makePhoneCall(phoneNumber);
  };

  const handleDirections = async (location: string) => {
    try {
      const directionsUrl = await getDirectionsUrl(location, userLocation || undefined);
      window.open(directionsUrl, '_blank');
    } catch (error) {
      console.error('Error getting directions:', error);
      // Fallback to basic directions without current address
      const fallbackUrl = `https://www.google.com/maps/dir/${encodeURIComponent(location)}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  // Auto refresh when radius changes 
  const handleRadiusChange = async (newRadius: number) => {
    setSearchRadius(newRadius);
    if (userLocation && paramedics.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const nearbyHospitals = await searchNearbyHospitals(userLocation, newRadius * 1000);
        setParamedics(nearbyHospitals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh results');
      } finally {
        setLoading(false);
      }
    }
  };

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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Service:
                  </label>
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

                <div className="flex items-center space-x-2">
                  <label htmlFor="radius" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Radius:
                  </label>
                  <select
                    id="radius"
                    value={searchRadius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 km</option>
                    <option value={2}>2 km</option>
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={15}>15 km</option>
                    <option value={20}>20 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>

                <div className="flex space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    <span>{loading ? 'Locating...' : 'Use My Location'}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading || !searchLocation.trim()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    {error.includes('API key') ? 'API Configuration Required' : 'Error'}
                  </h3>
                  <p className="text-red-800 text-sm mb-3">{error}</p>
                  {error.includes('API key') && (
                    <div className="text-red-700 text-sm space-y-1">
                      <p><strong>Setup Steps:</strong></p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Get a Google Maps API key from Google Cloud Console</li>
                        <li>Enable Places API (New) in your Google Cloud project</li>
                        <li>Create a <code className="bg-red-100 px-1 rounded">.env</code> file in your project root</li>
                        <li>Add <code className="bg-red-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
                        <li>Restart your development server</li>
                      </ol>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={loadNearbyHospitals}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                  >
                    Retry
                  </button>
                  {error.includes('API key') && (
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm text-center"
                    >
                      Get API Key
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center mb-6">
              <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Finding Nearby Hospitals</h3>
              <p className="text-gray-500">Please wait while we locate medical facilities in your area...</p>
            </div>
          )}

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

          {/* Results Info */}
          {!loading && paramedics.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  Found {filteredParamedics.length} result{filteredParamedics.length !== 1 ? 's' : ''}
                  {userLocation && ` within ${searchRadius} km`}
                </span>
              </div>
              {userLocation && (
                <div className="text-xs text-gray-500">
                  Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                </div>
              )}
            </div>
          )}

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
                  <span className={`text-sm font-medium ${paramedic.availability ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {paramedic.availability ? 'Open Now' : 'Closed'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCall(paramedic.phone)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleDirections(paramedic.location)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {!loading && filteredParamedics.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {userLocation ? "No Hospitals Found" : "Find Nearby Medical Services"}
              </h3>
              <p className="text-gray-500 mb-4">
                {userLocation
                  ? "No medical facilities found in your area. Try expanding your search radius or adjusting filters."
                  : "Click 'Use My Location' to find nearby hospitals and medical services, or search by location name."
                }
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4" />
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
                {userLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService('all');
                      setSearchLocation('');
                      loadNearbyHospitals();
                    }}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Access */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleCall('108')}
                className="flex items-center space-x-3 p-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Emergency (108)</p>
                  <p className="text-sm">Medical emergencies</p>
                </div>
              </button>
              <button
                onClick={() => handleCall('102')}
                className="flex items-center space-x-3 p-4 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <Truck className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Ambulance (102)</p>
                  <p className="text-sm">Patient transport</p>
                </div>
              </button>
              <button
                onClick={loadNearbyHospitals}
                className="flex items-center space-x-3 p-4 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <MapPin className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Refresh Location</p>
                  <p className="text-sm">Find nearby hospitals</p>
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