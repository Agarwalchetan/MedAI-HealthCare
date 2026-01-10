import express from 'express';
import { authenticate } from '../../../middlewares/authMiddleware.js';
import { getUserDocumentCounts } from '../controllers/userSummaryController.js';

const router = express.Router();

router.get('/document-counts', authenticate, getUserDocumentCounts);

export default router;
