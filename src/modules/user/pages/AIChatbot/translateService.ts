// Google Translate API service
const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Top 20 Indian languages for the chatbot
export const INDIAN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'mag', name: 'Magahi', nativeName: 'मगही' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' }
];

export class TranslateService {
  private static apiKey = GOOGLE_TRANSLATE_API_KEY;

  static async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key is not configured');
    }

    if (!text.trim()) {
      return { translatedText: text };
    }

    // If target language is the same as source, return original text
    if (sourceLanguage === targetLanguage && sourceLanguage !== 'auto') {
      return { translatedText: text };
    }

    try {
      const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage === 'auto' ? undefined : sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Translation failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data.translations || data.data.translations.length === 0) {
        throw new Error('Invalid response from Google Translate API');
      }

      const translation = data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error instanceof Error ? error : new Error('Translation failed');
    }
  }

  static async translateToEnglish(text: string, sourceLanguage: string = 'auto'): Promise<TranslationResult> {
    return this.translateText(text, 'en', sourceLanguage);
  }

  static async translateFromEnglish(text: string, targetLanguage: string): Promise<TranslationResult> {
    if (targetLanguage === 'en') {
      return { translatedText: text };
    }
    return this.translateText(text, targetLanguage, 'en');
  }

  static getLanguageByCode(code: string): Language | undefined {
    return INDIAN_LANGUAGES.find(lang => lang.code === code);
  }

  static getLanguageName(code: string): string {
    const language = this.getLanguageByCode(code);
    return language ? language.name : code;
  }

  static isValidLanguageCode(code: string): boolean {
    return INDIAN_LANGUAGES.some(lang => lang.code === code);
  }
}
