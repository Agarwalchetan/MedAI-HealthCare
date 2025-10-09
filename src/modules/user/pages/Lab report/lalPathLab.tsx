import React, { useState } from 'react';
import { X, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface LalPathLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportFetched?: (reportData: any) => void;
}

export const LalPathLabModal: React.FC<LalPathLabModalProps> = ({ isOpen, onClose, onReportFetched }) => {
  const [labId, setLabId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!labId.trim() || !password.trim()) {
      toast.error('Please enter both Lab ID and Password');
      return;
    }

    setIsLoading(true);
    setError('');
    setPdfUrl('');
    setShowPdf(false);

    try {
      // Step 1: Submit form to LalPath Labs website
      const response = await fetch('https://www.lalpathlabs.com/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        body: new URLSearchParams({
          'lab_id': labId,
          'password': password
        }),
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      
      // Step 2: Parse the response to find PDF links
      const pdfLinks = extractPdfLinks(html);
      
      if (pdfLinks.length === 0) {
        setError('No reports found. Please check your credentials and try again.');
        toast.error('No reports found');
        return;
      }

      // Step 3: Get the first PDF URL
      const firstPdfUrl = pdfLinks[0];
      setPdfUrl(firstPdfUrl);
      setShowPdf(true);
      
      // Step 4: Process the PDF and extract data
      await processPdfReport(firstPdfUrl);
      
      toast.success('Report fetched successfully!');
      
    } catch (error) {
      console.error('Error fetching LalPath report:', error);
      setError('Failed to fetch report. Please check your credentials and try again.');
      toast.error('Failed to fetch report');
    } finally {
      setIsLoading(false);
    }
  };

  const extractPdfLinks = (html: string): string[] => {
    const pdfLinks: string[] = [];
    
    // Look for PDF links in various formats
    const pdfPatterns = [
      /href=["']([^"']*\.pdf[^"']*)["']/gi,
      /src=["']([^"']*\.pdf[^"']*)["']/gi,
      /window\.open\(["']([^"']*\.pdf[^"']*)["']/gi,
      /location\.href\s*=\s*["']([^"']*\.pdf[^"']*)["']/gi
    ];

    pdfPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        let url = match[1];
        
        // Convert relative URLs to absolute
        if (url.startsWith('/')) {
          url = 'https://www.lalpathlabs.com' + url;
        } else if (!url.startsWith('http')) {
          url = 'https://www.lalpathlabs.com/' + url;
        }
        
        if (!pdfLinks.includes(url)) {
          pdfLinks.push(url);
        }
      }
    });

    return pdfLinks;
  };

  const processPdfReport = async (pdfUrl: string) => {
    try {
      // Fetch the PDF
      const pdfResponse = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/octet-stream,*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        credentials: 'include'
      });

      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
      }

      // Convert PDF to base64 for AI processing
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Process with AI to extract lab report data
      await processWithAI(base64, pdfUrl);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process PDF report');
    }
  };

  const processWithAI = async (base64Data: string, originalUrl: string) => {
    try {
      // Use Gemini AI to extract lab report data
      const genAI = new (window as any).google.generativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Please extract and analyze all information from this LalPath Labs report PDF.

      Step 1 - Extract:
      - Patient information (name, age, ID, contact details)
      - Lab information (LalPath Labs details, report number)
      - Test information (test names, types, categories)
      - Test results (values, units, reference ranges, flags)
      - Doctor information (referring doctor, lab technician)
      - Dates (collection date, report date, validity)
      - Any abnormal findings or critical values

      Step 2 - Organize:
      Format the key details as:
      - Patient: [name]
      - Lab: LalPath Labs
      - Report Number: [report number]
      - Date: [report date]
      - Tests: [list of all tests performed]
      - Results: [key findings and abnormal values]
      - Doctor: [referring doctor if mentioned]

      Step 3 - JSON Response:
      Return everything in this exact JSON format:
      {
        "extractedText": "Complete extracted text here",
        "category": "lab-report",
        "analysis": {
          "patientName": "extracted patient name",
          "labName": "LalPath Labs",
          "reportNumber": "report number",
          "date": "YYYY-MM-DD format or null",
          "testResults": [
            {"testName": "test name", "value": "result value", "unit": "unit", "normalRange": "normal range", "status": "Normal/Abnormal"}
          ],
          "doctorName": "referring doctor name",
          "abnormalFindings": ["list of abnormal findings"],
          "criticalValues": ["list of critical values if any"]
        },
        "confidence": 0.85
      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text().trim();

      if (text) {
        try {
          // Parse JSON response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            
            // Save to user's lab reports
            const reportData = {
              fileName: `LalPath_Report_${labId}_${new Date().toISOString().split('T')[0]}.pdf`,
              fileType: 'application/pdf',
              fileSize: base64Data.length * 0.75, // Approximate size
              category: 'lab-report',
              extractedText: parsedData.extractedText || text,
              aiAnalysis: {
                patientName: parsedData.analysis?.patientName || '',
                doctorName: parsedData.analysis?.doctorName || '',
                date: parsedData.analysis?.date ? new Date(parsedData.analysis.date) : undefined,
                medications: [],
                testResults: parsedData.analysis?.testResults || [],
                diagnosis: parsedData.analysis?.abnormalFindings?.join(', ') || '',
                labName: parsedData.analysis?.labName || 'LalPath Labs'
              },
              originalFileUrl: originalUrl,
              uploadDate: new Date(),
              isProcessed: true,
              confidence: parsedData.confidence || 0
            };

            // Save to database
            await saveReportToDatabase(reportData);
            
            // Notify parent component
            if (onReportFetched) {
              onReportFetched(reportData);
            }
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          toast.error('Failed to parse report data');
        }
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process report with AI');
    }
  };

  const saveReportToDatabase = async (reportData: any) => {
    try {
      const response = await fetch('/api/users/scanned-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error('Failed to save report to database');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  };

  const handleClose = () => {
    setLabId('');
    setPassword('');
    setPdfUrl('');
    setShowPdf(false);
    setError('');
    onClose();
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `LalPath_Report_${labId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fetch LalPath Labs Report</h3>
            <p className="text-sm text-gray-600 mt-1">Enter your lab credentials to download your report</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showPdf ? (
            /* Login Form */
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <img 
                    src="https://www.lalpathlabs.com/images/logo.png" 
                    alt="LalPath Labs" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-lg font-medium text-gray-900">LalPath Labs</span>
                </div>
                <p className="text-sm text-gray-600">
                  Enter your Lab/Visit ID and password to fetch your test reports directly from LalPath Labs.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab / Visit ID *
                  </label>
                  <input
                    type="text"
                    value={labId}
                    onChange={(e) => setLabId(e.target.value)}
                    placeholder="Enter your Lab ID or Visit ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Fetching Report...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Fetch Report</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Enter your LalPath Labs credentials</li>
                  <li>• We securely fetch your report from their website</li>
                  <li>• AI extracts and organizes your test data</li>
                  <li>• Report is saved to your health vault</li>
                </ul>
              </div>
            </div>
          ) : (
            /* PDF Viewer */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-700">Report fetched successfully!</span>
                </div>
                <button
                  onClick={downloadPdf}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full h-96"
                  title="LalPath Labs Report"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPdf(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to Form
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
