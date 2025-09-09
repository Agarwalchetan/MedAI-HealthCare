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

// Complete list of all 130+ languages supported by Google Translate API
export const SUPPORTED_LANGUAGES: Language[] = [
  // English (Primary)
  { code: 'en', name: 'English', nativeName: 'English' },

   // Indian Subcontinent Languages
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
   { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
   { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
   { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
   { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  
  // Major World Languages
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (简体)' },
//   { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  
 
  
//   // European Languages
//   { code: 'it', name: 'Italian', nativeName: 'Italiano' },
//   { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
//   { code: 'pl', name: 'Polish', nativeName: 'Polski' },
//   { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
//   { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
//   { code: 'da', name: 'Danish', nativeName: 'Dansk' },
//   { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
//   { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
//   { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
//   { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
//   { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
//   { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
//   { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
//   { code: 'ro', name: 'Romanian', nativeName: 'Română' },
//   { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
//   { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
//   { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
//   { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
//   { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
//   { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
//   { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
//   { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
//   { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
//   { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
//   { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
//   { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
//   { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
//   { code: 'ca', name: 'Catalan', nativeName: 'Català' },
//   { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
//   { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
//   { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
//   { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  
//   // East Asian Languages
//   { code: 'ko', name: 'Korean', nativeName: '한국어' },
//   { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  
//   // Southeast Asian Languages
//   { code: 'th', name: 'Thai', nativeName: 'ไทย' },
//   { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
//   { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
//   { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
//   { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
//   { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာ' },
//   { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
//   { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
//   { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano' },
//   { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
//   { code: 'hmn', name: 'Hmong', nativeName: 'Hmong' },
//   { code: 'jw', name: 'Javanese', nativeName: 'Basa Jawa' },
//   { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
  
//   // Middle Eastern & Central Asian Languages
//   { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
//   { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
//   { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî' },
//   { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی' },
//   { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
//   { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
//   { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
//   { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
//   { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen' },
//   { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  
//   // African Languages
//   { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
//   { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
//   { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
//   { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
//   { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
//   { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
//   { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
//   { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
//   { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
//   { code: 'sn', name: 'Shona', nativeName: 'chiShona' },
//   { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
//   { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
//   { code: 'lg', name: 'Luganda', nativeName: 'Luganda' },
//   { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa' },
//   { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  
//   // Latin American Languages
//   { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi' },
//   { code: 'gn', name: 'Guarani', nativeName: 'Avañeʼẽ' },
//   { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru' },
  
//   // Pacific Languages
//   { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa' },
//   { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga' },
//   { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti' },
//   { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori' },
  
//   // Additional European Languages
//   { code: 'fy', name: 'Frisian', nativeName: 'Frysk' },
//   { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig' },
//   { code: 'gl', name: 'Galician', nativeName: 'Galego' },
//   { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
  
//   // Additional Asian Languages
//   { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި' },
//   { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  
//   // Constructed Languages
//   { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
//   { code: 'la', name: 'Latin', nativeName: 'Latina' },
  
//   // Additional Languages
//   { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
//   { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
//   { code: 'iw', name: 'Hebrew (Legacy)', nativeName: 'עברית' },
//   { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
//   { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी' },
//   { code: 'kri', name: 'Krio', nativeName: 'Krio' },
//   { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی' },
//   { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ' },
//   { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng' },
//   { code: 'sep', name: 'Sepedi', nativeName: 'Sepedi' },
//   { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' },
//   { code: 'ak', name: 'Twi', nativeName: 'Twi' },
//   { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
//   { code: 'kri', name: 'Krio', nativeName: 'Krio' },
//   { code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
//   { code: 'nso', name: 'Northern Sotho', nativeName: 'Sepedi' },
//   { code: 'tn', name: 'Tswana', nativeName: 'Setswana' },
//   { code: 've', name: 'Venda', nativeName: 'Tshivenḓa' }
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
    return SUPPORTED_LANGUAGES.find((lang: Language) => lang.code === code);
  }

  static getLanguageName(code: string): string {
    const language = this.getLanguageByCode(code);
    return language ? language.name : code;
  }

  static isValidLanguageCode(code: string): boolean {
    return SUPPORTED_LANGUAGES.some((lang: Language) => lang.code === code);
  }
}
