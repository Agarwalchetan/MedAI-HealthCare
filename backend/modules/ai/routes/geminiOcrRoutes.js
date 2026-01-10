import express from 'express';
import { geminiOcr } from '../controllers/geminiOcrController.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticate);
router.post('/ocr', geminiOcr);

export default router;
