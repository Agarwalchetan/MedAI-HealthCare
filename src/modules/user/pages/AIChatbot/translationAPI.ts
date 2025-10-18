// Frontend API service for Sarvam Translation functionality
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TranslationResult {
  success: boolean;
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

class SarvamTranslationAPIService {
  // Short -> full code map for Sarvam
  private languageMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    ur: 'ur-IN',
    kn: 'kn-IN',
    or: 'od-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    mai: 'mai-IN',
    as: 'as-IN',
    sa: 'sa-IN',
    sat: 'sat-IN',
    ks: 'ks-IN',
    ne: 'ne-IN',
    kok: 'kok-IN',
    sd: 'sd-IN',
    doi: 'doi-IN',
    brx: 'brx-IN',
    mni: 'mni-IN',
  };

  private _getFullCode(code: string) {
    if (!code || code === 'auto') return 'auto';
    return this.languageMap[code] || code;
  }

  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`API request failed: ${response.status} ${text}`);
    }

    return response.json();
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<TranslationResult> {
    try {
      const response = await this.makeAuthenticatedRequest('/ai/translation/translate', {
        method: 'POST',
        body: JSON.stringify({
          text,
          targetLanguage: this._getFullCode(targetLanguage),
          sourceLanguage: this._getFullCode(sourceLanguage)
        })
      });

      return {
        success: response.success,
        translatedText: response.data.translatedText,
        detectedSourceLanguage: response.data.detectedSourceLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async translateToEnglish(text: string, sourceLanguage: string = 'auto'): Promise<TranslationResult> {
    return this.translateText(text, 'en', sourceLanguage);
  }

  async translateFromEnglish(text: string, targetLanguage: string): Promise<TranslationResult> {
    return this.translateText(text, targetLanguage, 'en');
  }

  async getSupportedLanguages(): Promise<Language[]> {
    try {
      const response = await this.makeAuthenticatedRequest('/ai/translation/languages', { method: 'GET' });
      if (!response.success) throw new Error(response.message || 'Failed to get supported languages');
      return response.data.languages;
    } catch (error) {
      console.warn('Falling back to static language list due to API error');
      return this.getStaticSupportedLanguages();
    }
  }

  getLanguageByCode(code: string): Language | undefined {
    return this.getStaticSupportedLanguages().find(lang => lang.code === code);
  }

  getLanguageName(code: string): string {
    const lang = this.getLanguageByCode(code);
    return lang ? lang.name : code;
  }

  isValidLanguageCode(code: string): boolean {
    return this.getStaticSupportedLanguages().some(lang => lang.code === code);
  }

  getStaticSupportedLanguages(): Language[] {
    return [
      // English
      { code: 'en', name: 'English', nativeName: 'English' },

      // Sarvam-supported Indian languages (as requested)
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
      { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
      { code: 'sat', name: 'Santali', nativeName: 'Santali' },
      { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी' },
      { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
      { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
      { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
      { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
      { code: 'brx', name: 'Bodo', nativeName: 'Bodo' },
      { code: 'mni', name: 'Manipuri', nativeName: 'Manipuri' },
    ];
  }
}

export const translationAPIService = new SarvamTranslationAPIService();
export default translationAPIService;
