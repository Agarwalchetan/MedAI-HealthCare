import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader, FileText, Pill, FlaskConical } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { userAPI } from '../../services/userAPI';
import { ScannedDocument } from '../../../../shared/types';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (extractedText: string) => void;
}


export { DocumentViewModal } from './DocumentViewModal';

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onSave }) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState<string>('');
    const [ocrProgress, setOcrProgress] = useState<number>(0);
    const [showExtractedText, setShowExtractedText] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'medical-history' | 'prescription' | 'lab-report' | 'other'>('other');
    const [isSaving, setIsSaving] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    // File upload 
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MIN_FILE_SIZE = 1024; // 1KB
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 10MB';
        }
        if (file.size < MIN_FILE_SIZE) {
            return 'File size must be at least 1KB';
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Only PDF, JPEG, and PNG files are allowed';
        }
        return null;
    };

    const handleFileSelect = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            setUploadedFile(null);
        } else {
            setUploadError('');
            setUploadedFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const resetUpload = () => {
        setUploadedFile(null);
        setUploadError('');
        setExtractedText('');
        setIsProcessing(false);
        setOcrProgress(0);
        setShowExtractedText(false);
        setSelectedCategory('other');
        setIsSaving(false);
        setAiAnalysis(null);
        onClose();
    };

    const processWithOCR = async () => {
        if (!uploadedFile) return;

        setIsProcessing(true);
        setOcrProgress(0);
        setExtractedText('');

        try {
            //Gemini AI
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            //file to base64 conversion (we can upload the direct image to gemini ai but fist we have to upload it any where else and then update it)
            //so, converting to base64 is an easy and time efficent option for both ai and user
            const base64 = await fileToBase64(uploadedFile);

            setOcrProgress(25);

            const prompt = `Please extract and analyze all text from this medical document image. 

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


            setOcrProgress(50);

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64,
                        mimeType: uploadedFile.type
                    }
                }
            ]);

            setOcrProgress(75);

            const response = await result.response;
            const text = response.text().trim();

            setOcrProgress(100);

            if (text) {
                try {
                    // Try to parse JSON response
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parsedData = JSON.parse(jsonMatch[0]);
                        setExtractedText(parsedData.extractedText || text);
                        setSelectedCategory(parsedData.category || 'other');
                        setAiAnalysis(parsedData.analysis || {});
                    } else {
                        // Fallback to plain text
                        setExtractedText(text);
                        setSelectedCategory('other');
                        setAiAnalysis({});
                    }
                    setShowExtractedText(true);
                } catch (error) {
                    // If JSON parsing fails, use the raw text
                    setExtractedText(text);
                    setSelectedCategory('other');
                    setAiAnalysis({});
                    setShowExtractedText(true);
                }
            } else {
                setUploadError('No text could be extracted from this file. Please try a clearer image.');
            }
        } catch (error) {
            console.error('OCR Error:', error);
            if (error instanceof Error && error.message.includes('API_KEY')) {
                setUploadError('Gemini API key is not configured. Please check your environment variables.');
            } else {
                setUploadError('Failed to extract text from the file. Please try again.');
            }
        } finally {
            setIsProcessing(false);
            setOcrProgress(0);
        }
    };

    //convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result as string;
                // Remove the prefix (data:image/jpeg;base64,)
                const base64Data = base64.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleUpload = () => {
        if (uploadedFile && !isProcessing) {
            processWithOCR();
        }
    };

    const saveExtractedData = async () => {
        if (!uploadedFile || !extractedText) return;

        setIsSaving(true);
        try {
            const documentData: Partial<ScannedDocument> = {
                fileName: uploadedFile.name,
                fileType: uploadedFile.type,
                fileSize: uploadedFile.size,
                category: selectedCategory,
                extractedText: extractedText,
                aiAnalysis: {
                    patientName: aiAnalysis?.patientName || '',
                    doctorName: aiAnalysis?.doctorName || '',
                    date: aiAnalysis?.date ? new Date(aiAnalysis.date) : undefined,
                    medications: aiAnalysis?.medications || [],
                    testResults: aiAnalysis?.testResults || [],
                    diagnosis: aiAnalysis?.diagnosis || '',
                    labName: aiAnalysis?.labName || ''
                },
                originalFileUrl: '', // We'll implement file upload later
                uploadDate: new Date(),
                isProcessed: true,
                confidence: aiAnalysis?.confidence || 0
            };

            await userAPI.addScannedDocument(documentData);
            onSave(extractedText);
            resetUpload();
        } catch (error) {
            console.error('Error saving document:', error);
            setUploadError('Failed to save document. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
               
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Medical Report</h3>
                    <button
                        onClick={resetUpload}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

            
                <div className="flex-1 overflow-y-auto p-6 pt-4">

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Upload your medical reports, lab results, or prescriptions for AI-powered analysis</p>
                    <div className="text-xs text-gray-500">
                        • Supported formats: PDF, JPEG, PNG<br />
                        • File size: 1KB - 10MB<br />
                        • AI will extract and organize medical information
                    </div>
                </div>

                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDragOver
                        ? 'border-blue-400 bg-blue-50'
                        : uploadedFile
                            ? 'border-green-400 bg-green-50'
                            : uploadError
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {isProcessing ? (
                        <div className="space-y-4">
                            <Loader className="h-8 w-8 text-blue-500 mx-auto animate-spin" />
                            <div>
                                <p className="font-medium text-blue-700">Processing with AI...</p>
                                <p className="text-sm text-blue-600 mt-1">Extracting and analyzing medical information</p>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${ocrProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-blue-500">{ocrProgress}% complete</p>
                        </div>
                    ) : uploadedFile ? (
                        <div className="space-y-2">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                            <p className="font-medium text-green-700">{uploadedFile.name}</p>
                            <p className="text-sm text-green-600">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Upload className={`h-8 w-8 mx-auto ${uploadError ? 'text-red-400' : 'text-gray-400'
                                }`} />
                            <p className="text-gray-600">
                                Drag and drop your file here, or{' '}
                                <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                    browse
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </p>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                )}

                {/* AI Analysis Results Display */}
                {showExtractedText && extractedText && (
                    <div className="mt-4 space-y-4">
                        {/* Category Selection */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-3">Document Category:</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'medical-history', label: 'Medical History', icon: <FileText className="h-4 w-4" /> },
                                    { id: 'prescription', label: 'Prescription', icon: <Pill className="h-4 w-4" /> },
                                    { id: 'lab-report', label: 'Lab Report', icon: <FlaskConical className="h-4 w-4" /> },
                                    { id: 'other', label: 'Other', icon: <FileText className="h-4 w-4" /> }
                                ].map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id as any)}
                                        className={`flex items-center space-x-2 p-2 rounded text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-blue-100'
                                            }`}
                                    >
                                        {category.icon}
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AI Analysis Summary */}
                        {aiAnalysis && Object.keys(aiAnalysis).length > 0 && (
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                <h4 className="font-medium text-purple-800 mb-2">AI Analysis Summary:</h4>
                                <div className="space-y-2 text-sm">
                                    {aiAnalysis.patientName && (
                                        <div><span className="font-medium">Patient:</span> {aiAnalysis.patientName}</div>
                                    )}
                                    {aiAnalysis.doctorName && (
                                        <div><span className="font-medium">Doctor:</span> {aiAnalysis.doctorName}</div>
                                    )}
                                    {aiAnalysis.diagnosis && (
                                        <div><span className="font-medium">Diagnosis:</span> {aiAnalysis.diagnosis}</div>
                                    )}
                                    {aiAnalysis.labName && (
                                        <div><span className="font-medium">Lab:</span> {aiAnalysis.labName}</div>
                                    )}
                                    {aiAnalysis.medications && aiAnalysis.medications.length > 0 && (
                                        <div><span className="font-medium">Medications:</span> {aiAnalysis.medications.length} found</div>
                                    )}
                                    {aiAnalysis.testResults && aiAnalysis.testResults.length > 0 && (
                                        <div><span className="font-medium">Test Results:</span> {aiAnalysis.testResults.length} found</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Extracted Text */}
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">Extracted Text:</h4>
                            <div className="max-h-60 overflow-y-auto bg-white p-3 rounded border border-gray-200 shadow-sm">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">{extractedText}</pre>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Scroll to view full text
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowExtractedText(false)}
                                className="flex-1 text-sm px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Hide
                            </button>
                            <button
                                onClick={saveExtractedData}
                                disabled={isSaving}
                                className="flex-1 text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? 'Saving...' : 'Save to Health Vault'}
                            </button>
                        </div>
                    </div>
                )}
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 p-6 pt-4">
                    <div className="flex space-x-3">
                        <button
                            onClick={resetUpload}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!uploadedFile || isProcessing}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isProcessing ? 'Processing...' : showExtractedText ? 'Process Again' : 'Analyze Document'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
