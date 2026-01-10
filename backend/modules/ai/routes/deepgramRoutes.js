import express from 'express';
import multer from 'multer';
import deepgramController from '../controllers/deepgramController.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

router.use(authenticate);


router.post('/transcribe', upload.single('audio'), deepgramController.transcribeAudio);


router.post('/tts', deepgramController.textToSpeech);

export default router;
