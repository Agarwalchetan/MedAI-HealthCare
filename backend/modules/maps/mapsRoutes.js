import express from 'express';
import { searchNearbyHospitals, searchHospitalsByText, getCurrentAddress } from './mapsController.js';

const router = express.Router();
router.post('/nearby', searchNearbyHospitals);
router.post('/search', searchHospitalsByText);
router.post('/geocode', getCurrentAddress);

export default router;
