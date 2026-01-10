import { sendSuccess, sendError } from '../../../utils/responseHelper.js';
import GeminiOcrService from '../services/geminiOcrService.js';

const geminiOcrService = new GeminiOcrService();

export const geminiOcr = async (req, res) => {
  try {
    const { base64, mimeType } = req.body;
    if (!base64 || !mimeType) {
      return sendError(res, 400, 'Missing base64 or mimeType');
    }
    // Always use the fixed backend prompt
    const result = await geminiOcrService.ocrWithGemini(base64, '', mimeType);
    return sendSuccess(res, 'OCR successful', result);
  } catch (error) {
    console.error('Gemini OCR error:', error);
    return sendError(res, 500, error.message || 'Gemini OCR failed');
  }
};

export default { geminiOcr };
