import { sendSuccess, sendError } from '../../../utils/responseHelper.js';
import TranslationService from '../services/translationService.js';

class TranslationController {
  constructor() {
    this.translationService = new TranslationService();
  }

  /**
   * Translate text from one language to another
   */
  translateText = async (req, res) => {
    try {
      const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;

      if (!text || !text.trim()) {
        return sendError(res, 400, 'Text is required');
      }

      if (!targetLanguage) {
        return sendError(res, 400, 'Target language is required');
      }

      const result = await this.translationService.translateText(text, targetLanguage, sourceLanguage);

      return sendSuccess(res, 'Text translated successfully', result);
    } catch (error) {
      console.error('Translation error:', error);
      return sendError(res, 500, error.message || 'Failed to translate text');
    }
  };

  /**
   * Translate text to English
   */
  translateToEnglish = async (req, res) => {
    try {
      const { text, sourceLanguage = 'auto' } = req.body;

      if (!text || !text.trim()) {
        return sendError(res, 400, 'Text is required');
      }

      const result = await this.translationService.translateToEnglish(text, sourceLanguage);

      return sendSuccess(res, 'Text translated to English successfully', result);
    } catch (error) {
      console.error('Translation error:', error);
      return sendError(res, 500, error.message || 'Failed to translate text to English');
    }
  };

  /**
   * Translate text from English to target language
   */
  translateFromEnglish = async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;

      if (!text || !text.trim()) {
        return sendError(res, 400, 'Text is required');
      }

      if (!targetLanguage) {
        return sendError(res, 400, 'Target language is required');
      }

      const result = await this.translationService.translateFromEnglish(text, targetLanguage);

      return sendSuccess(res, 'Text translated from English successfully', result);
    } catch (error) {
      console.error('Translation error:', error);
      return sendError(res, 500, error.message || 'Failed to translate text from English');
    }
  };

 
  getSupportedLanguages = async (req, res) => {
    try {
      const languages = this.translationService.getSupportedLanguages();

      return sendSuccess(res, 'Supported languages retrieved successfully', { languages });
    } catch (error) {
      console.error('Get languages error:', error);
      return sendError(res, 500, error.message || 'Failed to get supported languages');
    }
  };
}

export default new TranslationController();
