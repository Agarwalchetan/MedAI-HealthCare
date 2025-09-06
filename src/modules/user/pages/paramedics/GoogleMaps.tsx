import axios from 'axios';
import { Paramedic } from '../../../../shared/types';


interface Location {
    latitude: number;
    longitude: number;
}

interface GooglePlace {
    id: string;
    displayName: {
        text: string;
        languageCode: string;
    };
    formattedAddress: string;
    location: {
        latitude: number;
        longitude: number;
    };
    rating?: number;
    googleMapsUri: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    currentOpeningHours?: {
        openNow: boolean;
        periods: Array<{
            open: {
                day: number;
                hour: number;
                minute: number;
            };
            close?: {
                day: number;
                hour: number;
                minute: number;
            };
        }>;
    };
    types: string[];
    businessStatus?: string;
}

interface GooglePlacesResponse {
    places: GooglePlace[];
}

// Google Maps API 
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';


//   Calculate distance between two coordinates using a formula

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

//User current location

export const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
};


function isValidMedicalPlace(place: GooglePlace): boolean {
    const name = place.displayName.text.toLowerCase();

    //non-medical places for normal people
    const excludeKeywords = ['school', 'university', 'bank', 'restaurant', 'hotel', 'shopping'];
    return !excludeKeywords.some(keyword => name.includes(keyword));
}

// Convert Google Place to Paramedic interface

function convertPlaceToParamedic(place: GooglePlace, userLocation: Location): Paramedic {
    const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location.latitude,
        place.location.longitude
    );

    const name = place.displayName.text.toLowerCase();
    const types = place.types.map(type => type.toLowerCase());

    // Determine services based on place types and name
    const services: string[] = [];

    // Hospital
    if (types.includes('hospital') || name.includes('hospital') || name.includes('medical center')) {
        services.push('emergency', 'hospital', 'medical-supplies', 'consultation');
    }

    // Pharmacy
    if (types.includes('pharmacy') || name.includes('pharmacy') || name.includes('drug store') || name.includes('chemist')) {
        services.push('pharmacy', 'home-delivery', 'medical-supplies');
    }

    // Clinic and doctor
    if (types.includes('doctor') || name.includes('clinic') || name.includes('family practice') || name.includes('medical office')) {
        services.push('consultation', 'health-checkup');
    }

    // Dental
    if (types.includes('dentist') || name.includes('dental') || name.includes('orthodont')) {
        services.push('dental', 'consultation');
    }

    // Emergency
    if (name.includes('emergency') || name.includes('urgent care') || name.includes('trauma')) {
        services.push('emergency', '24x7-service', 'ambulance');
    }

    // Laboratory and diagnostic
    if (name.includes('lab') || name.includes('diagnostic') || name.includes('imaging') || name.includes('radiology')) {
        services.push('medical-supplies', 'health-checkup', 'consultation');
    }

    // Therapy and rehabilitation
    if (name.includes('therapy') || name.includes('rehab') || name.includes('physiotherapy') || name.includes('physical therapy')) {
        services.push('physiotherapy', 'home-care', 'consultation');
    }

    // Specialist services
    if (name.includes('cardiology') || name.includes('heart')) {
        services.push('consultation', 'health-checkup', 'specialist');
    }
    if (name.includes('pediatric') || name.includes('children')) {
        services.push('consultation', 'health-checkup', 'pediatric');
    }
    if (name.includes('surgery') || name.includes('surgical')) {
        services.push('consultation', 'surgery', 'specialist');
    }

    // Nursing and home care
    if (name.includes('nursing') || name.includes('home care') || name.includes('assisted living')) {
        services.push('home-care', 'nursing', 'consultation');
    }

    // Default services for general medical facilities
    if (services.length === 0) {
        services.push('consultation', 'health-checkup');
    }

    // Remove duplicates
    const uniqueServices = [...new Set(services)];

    // Check if it's an emergency contact
    const isEmergencyContact = types.includes('hospital') ||
        name.includes('emergency') ||
        name.includes('hospital') ||
        name.includes('urgent care');

    return {
        id: place.id,
        name: place.displayName.text,
        location: place.formattedAddress,
        distance: `${distance} km`,
        rating: place.rating || 4.0,
        phone: place.nationalPhoneNumber || place.internationalPhoneNumber || 'Not available',
        services: uniqueServices,
        availability: place.currentOpeningHours?.openNow ?? true,
        emergencyContact: isEmergencyContact
    };
}



export const searchNearbyHospitals = async (
    userLocation: Location,
    radiusMeters: number = 20000  //change the radius as needed
): Promise<Paramedic[]> => {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
    }

    try {
        // Use multiple API calls with specific medical types to get pre-filtered data
        const medicalQueries = [
            { includedTypes: ['hospital'] },
            { includedTypes: ['pharmacy'] },
            { includedTypes: ['doctor'] },
            { includedTypes: ['dentist'] },
            { includedTypes: ['physiotherapist'] }
        ];

        const allMedicalPlaces: GooglePlace[] = [];

        // Makeing parallel requests for all
        const requests = medicalQueries.map(async (query) => {
            const requestBody = {
                ...query,
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        },
                        radius: radiusMeters
                    }
                }
            };

            return axios.post<GooglePlacesResponse>(
                PLACES_API_URL,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.currentOpeningHours,places.types,places.businessStatus'
                    }
                }
            );
        });

        // wait for all requests to complete
        const responses = await Promise.all(requests);

        // combine all results
        responses.forEach(response => {
            if (response.data.places) {
                allMedicalPlaces.push(...response.data.places);
            }
        });

        // Remove duplicates by place ID
        const uniquePlaces = allMedicalPlaces.filter((place, index, self) =>
            index === self.findIndex(p => p.id === place.id)
        );

        console.log(`Found ${uniquePlaces.length} unique medical facilities from ${medicalQueries.length} API calls`);

        // filtering
        const paramedics = uniquePlaces
            .filter(place => isValidMedicalPlace(place))
            .map(place => convertPlaceToParamedic(place, userLocation))
            .filter(paramedic => {
                //filter by distance 
                const distance = parseFloat(paramedic.distance.replace(' km', ''));
                return distance <= (radiusMeters / 1000);
            })
            .sort((a, b) => {
                // sort by distance first
                const distanceA = parseFloat(a.distance.replace(' km', ''));
                const distanceB = parseFloat(b.distance.replace(' km', ''));
                if (distanceA !== distanceB) {
                    return distanceA - distanceB;
                }
                return b.rating - a.rating;
            });

        return paramedics;
    } catch (error) {
        console.error('Error fetching nearby hospitals:', error);
        if (axios.isAxiosError(error)) {
            console.error('Full error response:', {
                data: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });

            if (error.response?.status === 403) {
                throw new Error('Google Maps API key is invalid or quota exceeded');
            } else if (error.response?.status === 400) {
                const errorDetails = error.response?.data?.error;
                const errorMessage = errorDetails?.message || 'Invalid request parameters';
                console.error('Detailed API error:', errorDetails);
                throw new Error(`API Error: ${errorMessage}`);
            }
        }
        throw new Error('Failed to fetch nearby hospitals. Please check your internet connection and API configuration.');
    }
};


//Search hospitals by text query and location

export const searchHospitalsByText = async (
    query: string,
    userLocation: Location,
    radiusMeters: number = 10000
): Promise<Paramedic[]> => {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
    }

    try {
        // use multiple queries
        const medicalSearchQueries = [
            `${query} hospital`,
            `${query} medical center`,
            `${query} clinic`,
            `${query} pharmacy`,
            `${query} healthcare`
        ];

        const allSearchResults: GooglePlace[] = [];

        // make parallel text search requests
        const searchRequests = medicalSearchQueries.map(async (textQuery) => {
            const requestBody = {
                textQuery,
                maxResultCount: 10,
                locationBias: {
                    circle: {
                        center: {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        },
                        radius: radiusMeters
                    }
                }
            };

            return axios.post(
                PLACES_TEXT_SEARCH_URL,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.currentOpeningHours,places.types,places.businessStatus'
                    }
                }
            );
        });

        // wait for all search requests to complete
        const searchResponses = await Promise.all(searchRequests);

        // combine all search results
        searchResponses.forEach(response => {
            if (response.data.places) {
                allSearchResults.push(...response.data.places);
            }
        });

        // Remove duplicates 
        const uniqueSearchResults = allSearchResults.filter((place, index, self) =>
            index === self.findIndex(p => p.id === place.id)
        );


        // filtering
        return uniqueSearchResults
            .filter((place: GooglePlace) => isValidMedicalPlace(place))
            .map((place: GooglePlace) => convertPlaceToParamedic(place, userLocation))
            .sort((a, b) => {
                const distanceA = parseFloat(a.distance.replace(' km', ''));
                const distanceB = parseFloat(b.distance.replace(' km', ''));
                return distanceA - distanceB;
            });
    } catch (error) {
        console.error('Error searching hospitals by text:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            const errorMessage = error.response?.data?.error?.message || 'Search failed';
            throw new Error(`Search Error: ${errorMessage}`);
        }
        throw new Error('Failed to search hospitals. Please check your internet connection and API configuration.');
    }
};

// Function to get current address from coordinates using reverse geocoding
export const getCurrentAddress = async (location: Location): Promise<string> => {
    if (!GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key is not configured');
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        }

        // Fallback to coordinates if address not found
        return `${location.latitude},${location.longitude}`;
    } catch (error) {
        console.error('Error getting current address:', error);
        // Fallback to coordinates if geocoding fails
        return `${location.latitude},${location.longitude}`;
    }
};

//Google Maps directions URL - Uses live location address for better directions

export const getDirectionsUrl = async (destination: string, userLocation?: Location): Promise<string> => {
    const baseUrl = 'https://www.google.com/maps/dir/';

    if (userLocation) {
        try {
            // Get the current address from live location
            const currentAddress = await getCurrentAddress(userLocation);
            return `${baseUrl}${encodeURIComponent(currentAddress)}/${encodeURIComponent(destination)}`;
        } catch (error) {
            console.error('Error getting current address, falling back to coordinates:', error);
            return `${baseUrl}${userLocation.latitude},${userLocation.longitude}/${encodeURIComponent(destination)}`;
        }
    }

    // If no user location, just navigate to destination
    return `${baseUrl}/${encodeURIComponent(destination)}`;
};

//Make a phone call

export const makePhoneCall = (phoneNumber: string): void => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    window.open(`tel:${cleanNumber}`, '_self');
};
