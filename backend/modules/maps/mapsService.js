import axios from 'axios';
// Key accessed dynamically in functions
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

function isValidMedicalPlace(place) {
    const name = place.displayName.text.toLowerCase();
    const excludeKeywords = ['school', 'university', 'bank', 'restaurant', 'hotel', 'shopping'];
    return !excludeKeywords.some(keyword => name.includes(keyword));
}

function convertPlaceToParamedic(place, userLocation) {
    const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location.latitude,
        place.location.longitude
    );
    const name = place.displayName.text.toLowerCase();
    const types = place.types.map(type => type.toLowerCase());
    const services = [];
    if (types.includes('hospital') || name.includes('hospital') || name.includes('medical center')) {
        services.push('emergency', 'hospital', 'medical-supplies', 'consultation');
    }
    if (types.includes('pharmacy') || name.includes('pharmacy') || name.includes('drug store') || name.includes('chemist')) {
        services.push('pharmacy', 'home-delivery', 'medical-supplies');
    }
    if (types.includes('doctor') || name.includes('clinic') || name.includes('family practice') || name.includes('medical office')) {
        services.push('consultation', 'health-checkup');
    }
    if (types.includes('dentist') || name.includes('dental') || name.includes('orthodont')) {
        services.push('dental', 'consultation');
    }
    if (name.includes('emergency') || name.includes('urgent care') || name.includes('trauma')) {
        services.push('emergency', '24x7-service', 'ambulance');
    }
    if (name.includes('lab') || name.includes('diagnostic') || name.includes('imaging') || name.includes('radiology')) {
        services.push('medical-supplies', 'health-checkup', 'consultation');
    }
    if (name.includes('therapy') || name.includes('rehab') || name.includes('physiotherapy') || name.includes('physical therapy')) {
        services.push('physiotherapy', 'home-care', 'consultation');
    }
    if (name.includes('cardiology') || name.includes('heart')) {
        services.push('consultation', 'health-checkup', 'specialist');
    }
    if (name.includes('pediatric') || name.includes('children')) {
        services.push('consultation', 'health-checkup', 'pediatric');
    }
    if (name.includes('surgery') || name.includes('surgical')) {
        services.push('consultation', 'surgery', 'specialist');
    }
    if (name.includes('nursing') || name.includes('home care') || name.includes('assisted living')) {
        services.push('home-care', 'nursing', 'consultation');
    }
    if (services.length === 0) {
        services.push('consultation', 'health-checkup');
    }
    const uniqueServices = [...new Set(services)];
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

const searchNearbyHospitals = async (userLocation, radiusMeters = 20000) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');
    const medicalQueries = [
        { includedTypes: ['hospital'] },
        { includedTypes: ['pharmacy'] },
        { includedTypes: ['doctor'] },
        { includedTypes: ['dentist'] },
        { includedTypes: ['physiotherapist'] }
    ];
    const allMedicalPlaces = [];
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
        return axios.post(
            PLACES_API_URL,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.currentOpeningHours,places.types,places.businessStatus'
                }
            }
        );
    });
    const responses = await Promise.all(requests);
    responses.forEach(response => {
        if (response.data.places) {
            allMedicalPlaces.push(...response.data.places);
        }
    });
    const uniquePlaces = allMedicalPlaces.filter((place, index, self) =>
        index === self.findIndex(p => p.id === place.id)
    );
    return uniquePlaces
        .filter(isValidMedicalPlace)
        .map(place => convertPlaceToParamedic(place, userLocation))
        .filter(paramedic => parseFloat(paramedic.distance.replace(' km', '')) <= (radiusMeters / 1000))
        .sort((a, b) => {
            const distanceA = parseFloat(a.distance.replace(' km', ''));
            const distanceB = parseFloat(b.distance.replace(' km', ''));
            if (distanceA !== distanceB) return distanceA - distanceB;
            return b.rating - a.rating;
        });
};

const searchHospitalsByText = async (query, userLocation, radiusMeters = 10000) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');
    const medicalSearchQueries = [
        `${query} hospital`,
        `${query} medical center`,
        `${query} clinic`,
        `${query} pharmacy`,
        `${query} healthcare`
    ];
    const allSearchResults = [];
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
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.currentOpeningHours,places.types,places.businessStatus'
                }
            }
        );
    });
    const searchResponses = await Promise.all(searchRequests);
    searchResponses.forEach(response => {
        if (response.data.places) {
            allSearchResults.push(...response.data.places);
        }
    });
    const uniqueSearchResults = allSearchResults.filter((place, index, self) =>
        index === self.findIndex(p => p.id === place.id)
    );
    return uniqueSearchResults
        .filter(isValidMedicalPlace)
        .map(place => convertPlaceToParamedic(place, userLocation))
        .sort((a, b) => {
            const distanceA = parseFloat(a.distance.replace(' km', ''));
            const distanceB = parseFloat(b.distance.replace(' km', ''));
            return distanceA - distanceB;
        });
};

const getCurrentAddress = async (location) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not configured');
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`
    );
    if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
    }
    return `${location.latitude},${location.longitude}`;
};

export default {
    searchNearbyHospitals,
    searchHospitalsByText,
    getCurrentAddress
};
