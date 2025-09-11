import express from 'express';
import multer from 'multer';
import {
  registerLab,
  loginLab,
  logoutLab,
  getLabProfile,
  updateLabProfile,
  uploadLabReport,
  getLabReports,
  updateReportStatus,
  shareReportWithDoctor,
  getLabStats,
  getLabAnalytics,
  performQualityControl,
  getAvailableLabs,
  createLabRequest,
  assignLabToRequest,
  getPatientReports,
  getDoctorOrderedReports
} from '../controllers/labController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';
import { 
  validateLabRegistration,
  validateLabLogin,
  validateLabReportUpload,
  validateQualityControl
} from '../validations/labValidation.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lab-reports/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and DICOM files are allowed.'));
    }
  }
});

// Public routes
router.post('/register', validateLabRegistration, registerLab);
router.post('/login', validateLabLogin, loginLab);
router.get('/available', getAvailableLabs);

// Authentication routes
router.post('/logout', logoutLab);

// Protected routes for labs
router.use(authenticate);
router.use(authorize('lab'));

// Lab profile management
router.get('/profile', getLabProfile);
router.put('/profile', updateLabProfile);

// Report management
router.post('/reports/upload', upload.array('reportFiles', 5), validateLabReportUpload, uploadLabReport);
router.get('/reports', getLabReports);
router.put('/reports/:reportId/status', updateReportStatus);
router.post('/reports/:reportId/share-doctor', shareReportWithDoctor);
router.put('/reports/:reportId/quality-control', validateQualityControl, performQualityControl);

// Analytics and stats
router.get('/stats', getLabStats);
router.get('/analytics', getLabAnalytics);

// Cross-module routes (accessible by doctors/admins)
router.post('/requests', createLabRequest);
router.put('/requests/:requestId/assign', assignLabToRequest);
router.get('/patients/:patientId/reports', getPatientReports);
router.get('/doctors/:doctorId/reports', getDoctorOrderedReports);

export default router;