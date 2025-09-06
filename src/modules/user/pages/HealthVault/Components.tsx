import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (extractedText: string) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onSave }) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState<string>('');
    const [ocrProgress, setOcrProgress] = useState<number>(0);
    const [showExtractedText, setShowExtractedText] = useState(false);

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
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            //file to base64 conversion (we can upload the direct image to gemini ai but fist we have to upload it any where else and then update it)
            //so, converting to base64 is an easy and time efficent option for both ai and user
            const base64 = await fileToBase64(uploadedFile);

            setOcrProgress(25);

            const prompt = `Please extract all text from this medical document image. Focus on:
            - Patient information (name, age, ID)
            - Medical conditions and diagnoses
            - Prescriptions and medications
            - Lab results and values
            - Doctor information
            - Dates and timestamps
            - Any other relevant medical information
            
            Return the extracted text in a clear, organized format. If this is a prescription, organize it as:
            - Patient: [name]
            - Doctor: [name]
            - Date: [date]
            - Medications: [list with dosage and instructions]
            
            If this is a lab report, organize it as:
            - Patient: [name]
            - Lab: [name]
            - Date: [date]
            - Test Results: [list with values and ranges]`;

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
                setExtractedText(text);
                setShowExtractedText(true);
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

    const saveExtractedData = () => {
        onSave(extractedText);
        resetUpload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Medical Report</h3>
                    <button
                        onClick={resetUpload}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

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
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">AI Analysis Results:</h4>
                        <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <button
                                onClick={() => setShowExtractedText(false)}
                                className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Hide
                            </button>
                            <button
                                onClick={saveExtractedData}
                                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                Save to Health Vault
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
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
    );
};
