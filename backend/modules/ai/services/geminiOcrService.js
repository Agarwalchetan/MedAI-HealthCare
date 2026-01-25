import { GoogleGenerativeAI } from '@google/generative-ai';

// Centralized Gemini OCR prompt for HealthVault
const GEMINI_OCR_PROMPT = `Please extract and analyze all text from this medical document image. 

Step 1 - Extract:
- Patient information (name, age, ID)
- Medical conditions and diagnoses
- Prescriptions and medications with dosages
- Lab results and values with normal ranges
- Doctor information
- Dates and timestamps
- Lab or hospital names
- Any other relevant medical information

Step 2 - Categorize:
Determine the document type as one of:
- medical-history
- prescription
- lab-report
- other

Step 3 - Organize:
Format the key details depending on the category:

If this is a medical-history, format as:
- Patient: [name]
- Age: [age]
- ID: [patient ID]
- Diagnosis/Conditions: [list]
- Doctor: [doctor name]
- Date: [date]

If this is a prescription, format as:
- Patient: [name]
- Doctor: [name]
- Date: [date]
- Medications: [list with dosage and instructions]

If this is a lab report, format as:
- Patient: [name]
- Lab: [name]
- Date: [date]
- Test Results: [list with values and ranges]

If this is other, format as:
- Patient: [name]
- Document Type: [type or description]
- Date: [date]
- Key Information: [summary of extracted info]

Step 4 - JSON Response:
Return everything in this exact JSON format:
{
  "extractedText": "Complete extracted text here",
  "category": "medical-history|prescription|lab-report|other",
  "analysis": {
    "patientName": "extracted patient name",
    "doctorName": "extracted doctor name", 
    "date": "YYYY-MM-DD format or null",
    "medications": [
      {"name": "medication name", "dosage": "dosage", "frequency": "frequency"}
    ],
    "testResults": [
      {"testName": "test name", "value": "result value", "normalRange": "normal range"}
    ],
    "diagnosis": "diagnosis or condition",
    "labName": "lab or hospital name"
  },
  "confidence": 0.85
}`;

class GeminiOcrService {
  constructor() {
    this.modelName = 'gemini-2.5-flash';
  }

  get apiKey() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY not set in environment');
    return key;
  }


  async ocrWithGemini(base64, _prompt, mimeType) {
    // Always use the centralized prompt
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent([
      GEMINI_OCR_PROMPT,
      {
        inlineData: {
          data: base64,
          mimeType
        }
      }
    ]);
    const response = await result.response;
    const text = response.text().trim();
    // Try to parse JSON from Gemini response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { extractedText: text, category: 'other', analysis: {}, confidence: null };
  }
}

export default GeminiOcrService;
