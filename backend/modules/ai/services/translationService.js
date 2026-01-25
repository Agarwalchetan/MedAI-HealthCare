import fetch from 'node-fetch';

export class TranslationService {
  constructor() {
    this.baseUrl = 'https://api.sarvam.ai';
  }

  get apiKey() {
    const key = process.env.SARVAM_API_KEY;
    if (!key) {
      throw new Error('Sarvam API key is not configured. Set SARVAM_API_KEY in your environment.');
    }
    return key;
  }


  normalizeLangCode(code) {
    if (!code) return code;
    if (code.includes('-')) return code;
    const map = {
      en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN', ta: 'ta-IN', ur: 'ur-IN',
      gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', od: 'od-IN', or: 'od-IN', pa: 'pa-IN', as: 'as-IN',
      brx: 'brx-IN', doi: 'doi-IN', kok: 'kok-IN', ks: 'ks-IN', mai: 'mai-IN', mni: 'mni-IN',
      ne: 'ne-IN', sa: 'sa-IN', sat: 'sat-IN', sd: 'sd-IN'
    };
    return map[code] || code;
  }


  shortCode(code) {
    if (!code) return code;
    return code.split('-')[0];
  }


  async identifyLanguage(text) {
    try {
      const resp = await fetch(`${this.baseUrl}/text-lid`, {
        method: 'POST',
        headers: {
          'api-subscription-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!resp.ok) {
        const errTxt = await resp.text().catch(() => '');
        throw new Error(`Sarvam LID failed: ${resp.status} ${resp.statusText} ${errTxt}`);
      }
      const data = await resp.json();
      return data.language_code || null;
    } catch (e) {
      console.warn('Language identification failed, proceeding without detection:', e);
      return null;
    }
  }


  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text || !text.trim()) {
      return {
        success: true,
        translatedText: text,
        detectedSourceLanguage: sourceLanguage === 'auto' ? null : this.shortCode(sourceLanguage)
      };
    }

    const normalizedTarget = this.normalizeLangCode(targetLanguage);
    let normalizedSource = sourceLanguage && sourceLanguage !== 'auto' ? this.normalizeLangCode(sourceLanguage) : null;

    if (!normalizedSource) {
      const detected = await this.identifyLanguage(text);
      normalizedSource = detected || null;
    }

    if (!normalizedSource) {
      normalizedSource = 'en-IN';
    }

    if (normalizedSource === normalizedTarget) {
      return {
        success: true,
        translatedText: text,
        detectedSourceLanguage: this.shortCode(normalizedSource)
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'api-subscription-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: normalizedSource,
          target_language_code: normalizedTarget,
          model: 'sarvam-translate:v1'
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Sarvam API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.translated_text) {
        throw new Error('Invalid response from Sarvam API: missing translated_text');
      }

      const srcCode = data.source_language_code || normalizedSource;
      return {
        success: true,
        translatedText: data.translated_text,
        detectedSourceLanguage: this.shortCode(srcCode)
      };
    } catch (error) {
      console.error('Sarvam translation error:', error);
      throw error instanceof Error ? error : new Error('Translation failed');
    }
  }


  async translateToEnglish(text, sourceLanguage = 'auto') {
    return this.translateText(text, 'en-IN', sourceLanguage);
  }


  async translateFromEnglish(text, targetLanguage) {
    if (targetLanguage === 'en') {
      return {
        success: true,
        translatedText: text,
        detectedSourceLanguage: 'en'
      };
    }
    return this.translateText(text, targetLanguage, 'en-IN');
  }


  getSupportedLanguages() {
    return [
      // English (kept for default UI and model support)
      { code: 'en', name: 'English', nativeName: 'English' },

      // Sarvam-supported Indian languages
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

export default TranslationService;
