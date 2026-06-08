import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveScanner from './pages/LiveScanner';
import ManualEntry from './pages/ManualEntry';
import UploadPrescription from './pages/UploadPrescription';
import History from './pages/History';
import Login from './pages/Login';
import { prescriptionAPI } from './services/api';
import './App.css';

// ── Protected route wrapper ───────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" />Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// ── Main app (inside AuthProvider) ───────────────────────────────────────────
const AppInner = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);

  // Load prescriptions from backend when user logs in
  useEffect(() => {
    if (!user) return;
    prescriptionAPI.list({ limit: 100 })
      .then(res => {
        setPrescriptions(res.data.map(p => ({ ...p, id: p._id, timestamp: p.createdAt })));
        setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, [user]);

  // Save prescription — to backend if online, else local state only
  const addPrescription = async (prescription) => {
    const local = {
      ...prescription,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    // Optimistically add to local state
    setPrescriptions(prev => [local, ...prev]);

    // Try to persist to backend
    if (backendOnline && user) {
      try {
        const res = await prescriptionAPI.save({
          patientName:     prescription.patientName || '',
          patientAge:      prescription.patientAge  || null,
          prescriptionDate:prescription.prescriptionDate || new Date().toISOString(),
          source:          prescription.source || 'manual',
          fileName:        prescription.fileName || '',
          rawText:         prescription.rawText  || '',
          ocrConfidence:   prescription.confidence || null,
          drugs:           prescription.drugs || [],
          interactions:    prescription.interactions || [],
          ageWarnings:     prescription.ageWarnings  || [],
          alerts:          prescription.alerts || [],
          riskLevel:       prescription.riskLevel || 'safe',
          summary:         prescription.summary || '',
        });
        // Replace local entry with server entry (has real _id)
        setPrescriptions(prev =>
          prev.map(p => p.id === local.id
            ? { ...res.data, id: res.data._id, timestamp: res.data.createdAt }
            : p
          )
        );
      } catch (err) {
        console.warn('Could not save to backend:', err.message);
      }
    }
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar backendOnline={backendOnline} />
      <main className="main-content">
        {/* Backend status banner */}
        {!backendOnline && (
          <div className="offline-banner">
            ⚠️ Running in offline mode — prescriptions will not be saved to the database.
            Start the backend server with <code>npm run server</code> to enable persistence.
          </div>
        )}
        <Routes>
          <Route path="/"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<Dashboard prescriptions={prescriptions} />} />
          <Route path="/live-scanner" element={<LiveScanner addPrescription={addPrescription} />} />
          <Route path="/manual-entry" element={<ManualEntry addPrescription={addPrescription} />} />
          <Route path="/upload"       element={<UploadPrescription addPrescription={addPrescription} />} />
          <Route path="/history"      element={<History prescriptions={prescriptions} />} />
          <Route path="*"             element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppInner />
    </Router>
  </AuthProvider>
);

export default App;
