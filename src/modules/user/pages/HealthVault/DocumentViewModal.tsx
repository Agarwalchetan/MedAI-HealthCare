import React from 'react';
import { X, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({ isOpen, onClose, document }) => {
  const handleDownloadPDF = (document: any) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxContentHeight = pageHeight - 60; // Leave space for footer
    let yPosition = margin;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > maxContentHeight) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with automatic line wrapping and page breaks
    const addTextWithWrap = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      for (const line of lines) {
        checkPageBreak(15);
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      }
    };

    // Add title
    addTextWithWrap(document.fileName || document.condition || document.medicationName || document.testName || 'Document', 16, true);
    yPosition += 10;

    // Add document type
    const docType = 'category' in document ? document.category.replace('-', ' ').toUpperCase() : 'MEDICAL RECORD';
    addTextWithWrap(`Type: ${docType}`, 12);
    yPosition += 5;

    // Add date
    const date = document.uploadDate || document.dateRecorded || document.prescribedDate || document.reportDate;
    addTextWithWrap(`Date: ${new Date(date).toLocaleDateString()}`, 12);
    yPosition += 15;

    // Add content based on document type
    if ('category' in document) {
      // Scanned document
      if (document.aiAnalysis) {
        checkPageBreak(20);
        addTextWithWrap('AI Analysis:', 12, true);
        yPosition += 5;
        
        if (document.aiAnalysis.diagnosis) {
          checkPageBreak(15);
          addTextWithWrap(`Diagnosis: ${document.aiAnalysis.diagnosis}`);
        }
        if (document.aiAnalysis.doctorName) {
          checkPageBreak(15);
          addTextWithWrap(`Doctor: ${document.aiAnalysis.doctorName}`);
        }
        if (document.aiAnalysis.patientName) {
          checkPageBreak(15);
          addTextWithWrap(`Patient: ${document.aiAnalysis.patientName}`);
        }
        
        if (document.aiAnalysis.medications && document.aiAnalysis.medications.length > 0) {
          checkPageBreak(20);
          addTextWithWrap('Medications:', 12, true);
          yPosition += 5;
          
          document.aiAnalysis.medications.forEach((medication: any) => {
            if (typeof medication === 'object') {
              const medText = `${medication.name || 'Medication'}: ${medication.dosage || ''} ${medication.frequency ? `(${medication.frequency})` : ''}`;
              checkPageBreak(15);
              addTextWithWrap(`  • ${medText}`);
            } else {
              checkPageBreak(15);
              addTextWithWrap(`  • ${medication}`);
            }
          });
        }
        
        if (document.aiAnalysis.testResults && document.aiAnalysis.testResults.length > 0) {
          checkPageBreak(20);
          addTextWithWrap('Test Results:', 12, true);
          yPosition += 5;
          
          document.aiAnalysis.testResults.forEach((result: any) => {
            if (typeof result === 'object') {
              const testText = `${result.testName || 'Test'}: ${result.value || ''} ${result.unit || ''} ${result.referenceRange ? `(Ref: ${result.referenceRange})` : ''} ${result.status || ''}`;
              checkPageBreak(15);
              addTextWithWrap(`  • ${testText}`);
            } else {
              checkPageBreak(15);
              addTextWithWrap(`  • ${result}`);
            }
          });
        }
      }
    } else {
      // Regular medical record
      if (document.diagnosis) {
        checkPageBreak(15);
        addTextWithWrap(`Diagnosis: ${document.diagnosis}`);
      }
      if (document.dosage) {
        checkPageBreak(15);
        addTextWithWrap(`Dosage: ${document.dosage}`);
      }
      if (document.frequency) {
        checkPageBreak(15);
        addTextWithWrap(`Frequency: ${document.frequency}`);
      }
      if (document.testType) {
        checkPageBreak(15);
        addTextWithWrap(`Test Type: ${document.testType}`);
      }
      if (document.labName) {
        checkPageBreak(15);
        addTextWithWrap(`Lab: ${document.labName}`);
      }
      if (document.prescribedBy) {
        checkPageBreak(15);
        addTextWithWrap(`Prescribed By: ${document.prescribedBy}`);
      }
      if (document.doctorName) {
        checkPageBreak(15);
        addTextWithWrap(`Doctor: Dr. ${document.doctorName}`);
      }
    }

    // Add file info for scanned documents
    if ('category' in document) {
      yPosition += 10;
      checkPageBreak(20);
      addTextWithWrap('File Information:', 12, true);
      yPosition += 5;
      
      checkPageBreak(15);
      addTextWithWrap(`File Size: ${(document.fileSize / 1024 / 1024).toFixed(2)} MB`);
      
      checkPageBreak(15);
      addTextWithWrap(`File Type: ${document.fileType}`);
      
      checkPageBreak(15);
      addTextWithWrap(`Confidence: ${Math.round((document.confidence || 0) * 100)}%`);
    }

    // Add footer to all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by MedAI Health Vault', margin, pageHeight - 20);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, pageHeight - 20);
      pdf.text(new Date().toLocaleString(), pageWidth - margin - 80, pageHeight - 20);
    }

    // Download the PDF
    const fileName = document.fileName || document.condition || document.medicationName || document.testName || 'document';
    pdf.save(`${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {document.fileName || document.condition || document.medicationName || document.testName || 'Document'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Document Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Type:</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {'category' in document ? document.category.replace('-', ' ').toUpperCase() : 'MEDICAL RECORD'}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Date:</span>
              <span className="text-sm text-gray-900">
                {new Date(document.uploadDate || document.dateRecorded || document.prescribedDate || document.reportDate).toLocaleDateString()}
              </span>
            </div>

            {/* File Info for Scanned Documents */}
            {'category' in document && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">File Size:</span>
                  <span className="text-sm text-gray-900">{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">File Type:</span>
                  <span className="text-sm text-gray-900">{document.fileType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Confidence:</span>
                  <span className="text-sm text-gray-900">{Math.round((document.confidence || 0) * 100)}%</span>
                </div>
              </div>
            )}

            {/* AI Analysis for Scanned Documents */}
            {'category' in document && document.aiAnalysis && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {document.aiAnalysis.diagnosis && (
                    <div>
                      <span className="font-medium text-gray-700">Diagnosis:</span>
                      <p className="text-gray-900 mt-1">{document.aiAnalysis.diagnosis}</p>
                    </div>
                  )}
                  {document.aiAnalysis.doctorName && (
                    <div>
                      <span className="font-medium text-gray-700">Doctor:</span>
                      <p className="text-gray-900 mt-1">{document.aiAnalysis.doctorName}</p>
                    </div>
                  )}
                  {document.aiAnalysis.patientName && (
                    <div>
                      <span className="font-medium text-gray-700">Patient:</span>
                      <p className="text-gray-900 mt-1">{document.aiAnalysis.patientName}</p>
                    </div>
                  )}
                  {document.aiAnalysis.medications && document.aiAnalysis.medications.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Medications:</span>
                      <div className="text-gray-900 mt-1">
                        {Array.isArray(document.aiAnalysis.medications) ? (
                          document.aiAnalysis.medications.map((medication: any, index: number) => (
                            <div key={index} className="mb-1">
                              {typeof medication === 'object' ? (
                                <div className="ml-2">
                                  {medication.name && <span className="font-medium">{medication.name}</span>}
                                  {medication.dosage && <span> - {medication.dosage}</span>}
                                  {medication.frequency && <span> ({medication.frequency})</span>}
                                </div>
                              ) : (
                                <span>{medication}</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span>{document.aiAnalysis.medications}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {document.aiAnalysis.testResults && document.aiAnalysis.testResults.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Test Results:</span>
                      <div className="text-gray-900 mt-1">
                        {Array.isArray(document.aiAnalysis.testResults) ? (
                          document.aiAnalysis.testResults.map((result: any, index: number) => (
                            <div key={index} className="mb-1">
                              {typeof result === 'object' ? (
                                <div className="ml-2">
                                  {result.testName && <span className="font-medium">{result.testName}: </span>}
                                  {result.value && <span>{result.value}</span>}
                                  {result.unit && <span className="text-gray-500"> {result.unit}</span>}
                                  {result.referenceRange && <span className="text-gray-500"> (Ref: {result.referenceRange})</span>}
                                  {result.status && <span className={`ml-2 px-1 py-0.5 rounded text-xs ${result.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.status}</span>}
                                </div>
                              ) : (
                                <span>{result}</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span>{document.aiAnalysis.testResults}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regular Medical Record Content */}
            {!('category' in document) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {document.diagnosis && (
                    <div>
                      <span className="font-medium text-gray-700">Diagnosis:</span>
                      <p className="text-gray-900 mt-1">{document.diagnosis}</p>
                    </div>
                  )}
                  {document.dosage && (
                    <div>
                      <span className="font-medium text-gray-700">Dosage:</span>
                      <p className="text-gray-900 mt-1">{document.dosage}</p>
                    </div>
                  )}
                  {document.frequency && (
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <p className="text-gray-900 mt-1">{document.frequency}</p>
                    </div>
                  )}
                  {document.testType && (
                    <div>
                      <span className="font-medium text-gray-700">Test Type:</span>
                      <p className="text-gray-900 mt-1">{document.testType}</p>
                    </div>
                  )}
                  {document.labName && (
                    <div>
                      <span className="font-medium text-gray-700">Lab:</span>
                      <p className="text-gray-900 mt-1">{document.labName}</p>
                    </div>
                  )}
                  {document.prescribedBy && (
                    <div>
                      <span className="font-medium text-gray-700">Prescribed By:</span>
                      <p className="text-gray-900 mt-1">{document.prescribedBy}</p>
                    </div>
                  )}
                  {document.doctorName && (
                    <div>
                      <span className="font-medium text-gray-700">Doctor:</span>
                      <p className="text-gray-900 mt-1">Dr. {document.doctorName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              handleDownloadPDF(document);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
