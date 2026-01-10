import mapsService from './mapsService.js';

export const searchNearbyHospitals = async (req, res) => {
    try {
        const { userLocation, radiusMeters } = req.body;
        const results = await mapsService.searchNearbyHospitals(userLocation, radiusMeters);
        res.json({ paramedics: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchHospitalsByText = async (req, res) => {
    try {
        const { query, userLocation, radiusMeters } = req.body;
        const results = await mapsService.searchHospitalsByText(query, userLocation, radiusMeters);
        res.json({ paramedics: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCurrentAddress = async (req, res) => {
    try {
        const { location } = req.body;
        const address = await mapsService.getCurrentAddress(location);
        res.json({ address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
