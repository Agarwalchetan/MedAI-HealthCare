import axios from 'axios';
import { Paramedic } from '../../../../shared/types';


interface Location {
    latitude: number;
    longitude: number;
}


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MAPS_API_URL = `${API_BASE_URL}/maps`;

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




export const searchNearbyHospitals = async (
    userLocation: Location,
    radiusMeters: number = 20000
): Promise<Paramedic[]> => {
    try {
        const response = await axios.post(`${MAPS_API_URL}/nearby`, {
            userLocation,
            radiusMeters
        });
        return response.data.paramedics;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || 'Failed to fetch nearby hospitals.');
    }
};


//Search hospitals by text query and location


export const searchHospitalsByText = async (
    query: string,
    userLocation: Location,
    radiusMeters: number = 10000
): Promise<Paramedic[]> => {
    try {
        const response = await axios.post(`${MAPS_API_URL}/search`, {
            query,
            userLocation,
            radiusMeters
        });
        return response.data.paramedics;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error || 'Failed to search hospitals.');
    }
};


// Function to get current address from coordinates using backend reverse geocoding
export const getCurrentAddress = async (location: Location): Promise<string> => {
    try {
        const response = await axios.post(`${MAPS_API_URL}/geocode`, { location });
        return response.data.address;
    } catch (error: any) {
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
