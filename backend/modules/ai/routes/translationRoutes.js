import express from 'express';
import translationController from '../controllers/translationController.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);


router.post('/translate', translationController.translateText);


router.post('/to-english', translationController.translateToEnglish);


router.post('/from-english', translationController.translateFromEnglish);


router.get('/languages', translationController.getSupportedLanguages);

export default router;
