import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle, Loader } from 'lucide-react';
import { extractTextFromImage, parsePrescriptionText } from '../utils/ocrProcessor';
import { analyzePrescription } from '../utils/drugInteractionChecker';
import ValidationResults from '../components/ValidationResults';
import ManualDrugEntry from '../components/ManualDrugEntry';
import './LiveScanner.css';

const LiveScanner = ({ addPrescription }) => {
  const webcamRef   = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing]   = useState(false);
  const [ocrProgress, setOcrProgress]     = useState(0);
  const [results, setResults]             = useState(null);
  const [rawText, setRawText]             = useState('');
  const [cameraError, setCameraError]     = useState(false);
  const [patientAge, setPatientAge]       = useState('');
  // true  → OCR ran but found nothing → auto-open manual panel
  const [ocrFoundNothing, setOcrFoundNothing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setResults(null);
      setRawText('');
      setOcrFoundNothing(false);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setResults(null);
    setRawText('');
    setOcrProgress(0);
    setOcrFoundNothing(false);
  };

  const processImage = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setOcrProgress(0);
    setOcrFoundNothing(false);

    try {
      const ocrResult = await extractTextFromImage(capturedImage, setOcrProgress);
      if (!ocrResult.success) throw new Error(ocrResult.error);

      setRawText(ocrResult.text);
      const parsedDrugs = parsePrescriptionText(ocrResult.text);

      if (parsedDrugs.length === 0) {
        // OCR ran but detected nothing — show info result and open manual panel
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
          source: 'live-scan',
          image: capturedImage,
          rawText: ocrResult.text,
          confidence: ocrResult.confidence,
          ...analysis,
        });
      }
    } catch (error) {
      setResults({
        riskLevel: 'danger',
        summary: `Error processing image: ${error.message}`,
        drugs: [],
        interactions: [],
        ageWarnings: [],
        alerts: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Called by ManualDrugEntry when user clicks "Analyze Manually"
  const handleManualAnalyze = (drugs) => {
    const analysis = analyzePrescription(drugs, patientAge !== '' ? patientAge : null);
    setResults(analysis);
    addPrescription({
      source: 'live-scan',
      image: capturedImage,
      rawText: rawText || '(manual entry)',
      manualEntry: true,
      ...analysis,
    });
  };

  return (
    <div className="live-scanner">
      <div className="page-header">
        <h1>Live Scanner</h1>
        <p>Scan a prescription with your camera, or enter medications manually if detection fails</p>
      </div>

      <div className="scanner-layout">
        {/* ── Left column: camera + manual entry ── */}
        <div className="camera-section">

          {/* Camera view */}
          <div className="camera-container">
            {!capturedImage ? (
              <>
                {cameraError ? (
                  <div className="camera-error">
                    <Camera size={48} />
                    <p>Camera access denied or unavailable</p>
                    <p className="hint">Please allow camera access in your browser settings</p>
                  </div>
                ) : (
                  <>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="webcam"
                      onUserMediaError={() => setCameraError(true)}
                      videoConstraints={{ width: 1280, height: 720, facingMode: 'environment' }}
                    />
                    <div className="scan-overlay">
                      <div className="scan-frame" />
                      <p className="scan-hint">Position prescription within the frame</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <img src={capturedImage} alt="Captured prescription" className="captured-image" />
            )}
          </div>

          {/* Age + capture controls */}
          <div className="camera-controls">
            <div className="age-input-row">
              <label htmlFor="ls-age">Patient Age (years)</label>
              <input
                id="ls-age"
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

            {!capturedImage ? (
              <button
                className="btn btn-primary btn-capture"
                onClick={capture}
                disabled={cameraError}
              >
                <Camera size={20} />
                Capture Prescription
              </button>
            ) : (
              <div className="capture-actions">
                <button className="btn btn-secondary" onClick={retake}>
                  <RefreshCw size={20} />
                  Retake
                </button>
                <button
                  className="btn btn-primary"
                  onClick={processImage}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader size={20} className="spin" /> Processing... {ocrProgress}%</>
                  ) : (
                    <><CheckCircle size={20} /> Analyze Prescription</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* OCR progress */}
          {isProcessing && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${ocrProgress}%` }} />
              <p>Running OCR analysis... {ocrProgress}%</p>
            </div>
          )}

          {/* Extracted text */}
          {rawText && (
            <div className="raw-text-section">
              <h3>Extracted Text</h3>
              <pre className="raw-text">{rawText}</pre>
            </div>
          )}

          {/* ── Manual entry panel ──
              Auto-opens when OCR found nothing; always available via toggle */}
          <ManualDrugEntry
            onAnalyze={handleManualAnalyze}
            defaultOpen={ocrFoundNothing}
            title="Enter Medications Manually"
            subtitle={
              ocrFoundNothing
                ? 'OCR detected no drugs — add them here'
                : 'Optionally add or correct medications not detected by OCR'
            }
          />
        </div>

        {/* ── Right column: results ── */}
        <div className="results-section">
          {results ? (
            <ValidationResults results={results} />
          ) : (
            <div className="results-placeholder">
              <Camera size={64} color="#d1d5db" />
              <h3>No Results Yet</h3>
              <p>Capture and analyze a prescription, or enter medications manually</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScanner;
