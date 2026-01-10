import { sendSuccess, sendError } from '../../../utils/responseHelper.js';
import DeepgramService from '../services/deepgramService.js';

class DeepgramController {
  constructor() {
    this.deepgramService = new DeepgramService();
  }


  transcribeAudio = async (req, res) => {
    try {
      if (!req.file) {
        return errorResponse(res, 'No audio file provided', 400);
      }

      const audioBuffer = req.file.buffer;
      const contentType = req.file.mimetype;

      const result = await this.deepgramService.transcribeAudio(audioBuffer, contentType);

      return sendSuccess(res, 'Audio transcribed successfully', result);
    } catch (error) {
      console.error('Transcription error:', error);
      return sendError(res, 500, error.message || 'Failed to transcribe audio');
    }
  };


  textToSpeech = async (req, res) => {
    try {
      const { text, model } = req.body;

      if (!text || !text.trim()) {
        return sendError(res, 400, 'Text is required');
      }

      const audioBuffer = await this.deepgramService.textToSpeech(text, model);

      // Set appropriate headers for audio response
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Content-Disposition': 'inline; filename="speech.mp3"'
      });

      return res.send(audioBuffer);
    } catch (error) {
      console.error('TTS error:', error);
      return sendError(res, 500, error.message || 'Failed to generate speech');
    }
  };
}

export default new DeepgramController();
