import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileImage, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { extractTextFromImage, parsePrescriptionText } from '../utils/ocrProcessor';
import { analyzePrescription } from '../utils/drugInteractionChecker';
import ValidationResults from '../components/ValidationResults';
import ManualDrugEntry from '../components/ManualDrugEntry';
import './UploadPrescription.css';

const UploadPrescription = ({ addPrescription }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver]       = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl]   = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [results, setResults]         = useState(null);
  const [rawText, setRawText]         = useState('');
  const [error, setError]             = useState('');
  const [patientAge, setPatientAge]   = useState('');
  // true → OCR ran but found nothing → auto-open manual panel
  const [ocrFoundNothing, setOcrFoundNothing] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg','image/png','image/gif','image/webp','image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image file (JPEG, PNG, GIF, WebP, BMP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    setError('');
    setUploadedFile(file);
    setResults(null);
    setRawText('');
    setOcrFoundNothing(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setRawText('');
    setError('');
    setOcrProgress(0);
    setOcrFoundNothing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setOcrProgress(0);
    setError('');
    setOcrFoundNothing(false);

    try {
      const ocrResult = await extractTextFromImage(previewUrl, setOcrProgress);
      if (!ocrResult.success) throw new Error(ocrResult.error);

      setRawText(ocrResult.text);
      const parsedDrugs = parsePrescriptionText(ocrResult.text);

      if (parsedDrugs.length === 0) {
        setOcrFoundNothing(true);
        setResults({
          riskLevel: 'info',
          summary: 'No medications were detected automatically. Use the manual entry panel below to add drugs.',
          drugs: [],
          interactions: [],
          ageWarnings: [],
          alerts: [],
        });
      } else {
        const analysis = analyzePrescription(parsedDrugs, patientAge !== '' ? patientAge : null);
        setResults(analysis);
        addPrescription({
          source: 'upload',
          fileName: uploadedFile.name,
          rawText: ocrResult.text,
          confidence: ocrResult.confidence,
          ...analysis,
        });
      }
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Called by ManualDrugEntry when user clicks "Analyze Manually"
  const handleManualAnalyze = (drugs) => {
    const analysis = analyzePrescription(drugs, patientAge !== '' ? patientAge : null);
    setResults(analysis);
    addPrescription({
      source: 'upload',
      fileName: uploadedFile?.name || 'manual',
      rawText: rawText || '(manual entry)',
      manualEntry: true,
      ...analysis,
    });
  };

  return (
    <div className="upload-prescription">
      <div className="page-header">
        <h1>Upload Prescription</h1>
        <p>Upload an image for OCR analysis, or enter medications manually if detection fails</p>
      </div>

      <div className="upload-layout">
        {/* ── Left column: upload + manual entry ── */}
        <div className="upload-section">

          {/* Drop zone / file preview */}
          {!uploadedFile ? (
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="file-input"
              />
              <div className="drop-zone-content">
                <Upload size={48} color="#9ca3af" />
                <h3>Drop your prescription here</h3>
                <p>or click to browse files</p>
                <p className="file-hint">Supports: JPEG, PNG, GIF, WebP, BMP (max 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="file-preview">
              <div className="preview-header">
                <div className="file-info">
                  <FileImage size={20} color="#3b82f6" />
                  <span className="file-name">{uploadedFile.name}</span>
                  <span className="file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button className="btn-icon" onClick={clearFile}>
                  <X size={20} color="#6b7280" />
                </button>
              </div>

              <div className="image-preview-container">
                <img src={previewUrl} alt="Prescription preview" className="image-preview" />
              </div>

              {/* Age + action buttons */}
              <div className="upload-actions">
                <div className="age-input-row">
                  <label htmlFor="up-age">Patient Age (years)</label>
                  <input
                    id="up-age"
                    type="number"
                    value={patientAge}
                    onChange={e => setPatientAge(e.target.value)}
                    placeholder="e.g. 2"
                    className="age-input"
                    min="0"
                    max="150"
                    step="0.1"
                  />
                </div>
                <button className="btn btn-secondary" onClick={clearFile}>
                  Remove
                </button>
                <button
                  className="btn btn-primary"
                  onClick={processFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader size={18} className="spin" /> Analyzing... {ocrProgress}%</>
                  ) : (
                    <><CheckCircle size={18} /> Analyze Prescription</>
                  )}
                </button>
              </div>

              {isProcessing && (
                <div className="progress-container">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${ocrProgress}%` }} />
                  </div>
                  <p className="progress-label">Running OCR... {ocrProgress}%</p>
                </div>
              )}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted text */}
          {rawText && (
            <div className="extracted-text-card">
              <h3>Extracted Text</h3>
              <pre className="extracted-text">{rawText}</pre>
            </div>
          )}

          {/* ── Manual entry panel ──
              Auto-opens when OCR found nothing; always available via toggle.
              Also shown even before uploading so user can skip OCR entirely. */}
          <ManualDrugEntry
            onAnalyze={handleManualAnalyze}
            defaultOpen={ocrFoundNothing}
            title="Enter Medications Manually"
            subtitle={
              ocrFoundNothing
                ? 'OCR detected no drugs — add them here'
                : 'Skip OCR or correct medications not detected automatically'
            }
          />
        </div>

        {/* ── Right column: results ── */}
        <div className="results-panel">
          {results ? (
            <ValidationResults results={results} />
          ) : (
            <div className="results-placeholder">
              <Upload size={64} color="#d1d5db" />
              <h3>No Results Yet</h3>
              <p>Upload a prescription image and analyze it, or enter medications manually</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
