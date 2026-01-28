# Gemini API Setup for Health Vault OCR

## Overview
The Health Vault now uses Google's Gemini AI for intelligent document analysis and text extraction from medical documents. This provides better accuracy and medical context understanding compared to traditional OCR.

## Setup Steps

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the generated API key

### 2. Configure Environment Variables
1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### 3. Restart Development Server
After adding the environment variable, restart your development server:
```bash
npm run dev
```

## Features

### AI-Powered Document Analysis
- **Smart Text Extraction**: Gemini AI understands medical context and extracts relevant information
- **Structured Output**: Automatically organizes extracted data into categories (patient info, medications, lab results, etc.)
- **Medical Context**: Better understanding of medical terminology and document structure

### Supported Document Types
- **Prescriptions**: Extracts patient name, doctor info, medications with dosages
- **Lab Reports**: Identifies test results, values, and reference ranges
- **Medical Records**: Captures diagnoses, conditions, and treatment information
- **Insurance Documents**: Extracts coverage and policy details

### File Support
- **Formats**: PDF, JPEG, PNG
- **Size Limit**: 1KB - 10MB
- **Quality**: Works with both high and medium quality images

## Error Handling

### Common Issues
1. **Missing API Key**: Shows clear error message with setup instructions
2. **API Quota Exceeded**: Graceful error handling with retry option
3. **Invalid File Format**: Clear validation messages
4. **Network Issues**: Automatic retry functionality

### Troubleshooting
1. Check browser console for detailed error messages
2. Verify API key is correctly set in `.env` file
3. Ensure Gemini API is enabled in Google AI Studio
4. Check API key restrictions and quotas
5. Try refreshing the page to retry API calls

## Security Features

- **Client-Side Processing**: Files are processed locally before sending to Gemini
- **No Data Storage**: Gemini API doesn't store your medical documents
- **Secure Transmission**: All API calls use HTTPS
- **Privacy Compliant**: Follows Google's data usage policies

## Future Enhancements

- **Custom Prompts**: Allow users to specify what information to extract
- **Batch Processing**: Process multiple documents at once
- **Data Validation**: Cross-reference extracted data with medical databases
- **Integration**: Connect with existing health records systems

## API Usage

The implementation uses:
- **Model**: `gemini-1.5-flash` (fast and efficient)
- **Input**: Base64 encoded images with medical document prompts
- **Output**: Structured text with medical information organized by category

## Cost Considerations

- Gemini API has usage-based pricing
- Free tier available for development and testing
- Monitor usage in Google AI Studio dashboard
- Consider implementing caching for production use
