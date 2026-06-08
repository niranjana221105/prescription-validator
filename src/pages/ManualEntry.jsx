import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, User, Calendar } from 'lucide-react';
import { analyzePrescription } from '../utils/drugInteractionChecker';
import ValidationResults from '../components/ValidationResults';
import './ManualEntry.css';

const FREQUENCY_OPTIONS = [
  { value: '1', label: 'Once daily (OD)' },
  { value: '2', label: 'Twice daily (BID)' },
  { value: '3', label: 'Three times daily (TID)' },
  { value: '4', label: 'Four times daily (QID)' },
  { value: '0.5', label: 'Every other day' }
];

const UNIT_OPTIONS = ['mg', 'mcg', 'g', 'ml', 'units'];

const emptyDrug = () => ({
  id: Date.now(),
  name: '',
  dosage: '',
  unit: 'mg',
  frequency: '1',
  route: 'oral'
});

const ManualEntry = ({ addPrescription }) => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [drugs, setDrugs] = useState([emptyDrug()]);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const addDrug = () => {
    setDrugs(prev => [...prev, emptyDrug()]);
  };

  const removeDrug = (id) => {
    setDrugs(prev => prev.filter(d => d.id !== id));
  };

  const updateDrug = (id, field, value) => {
    setDrugs(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [`${id}-${field}`]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    drugs.forEach(drug => {
      if (!drug.name.trim()) {
        newErrors[`${drug.id}-name`] = 'Drug name is required';
        valid = false;
      }
      if (!drug.dosage || isNaN(parseFloat(drug.dosage))) {
        newErrors[`${drug.id}-dosage`] = 'Valid dosage is required';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleAnalyze = () => {
    if (!validate()) return;

    const analysis = analyzePrescription(drugs, patientAge !== '' ? patientAge : null);
    setResults(analysis);

    addPrescription({
      source: 'manual',
      patientName,
      patientAge,
      prescriptionDate,
      ...analysis
    });
  };

  const handleReset = () => {
    setDrugs([emptyDrug()]);
    setResults(null);
    setErrors({});
    setPatientName('');
    setPatientAge('');
  };

  return (
    <div className="manual-entry">
      <div className="page-header">
        <h1>Manual Entry</h1>
        <p>Enter prescription details manually for validation</p>
      </div>

      <div className="entry-layout">
        <div className="entry-form">
          <div className="form-card">
            <h2>Patient Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} />
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={e => setPatientAge(e.target.value)}
                  placeholder="Age"
                  className="form-input"
                  min="0"
                  max="150"
                />
              </div>
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Prescription Date
                </label>
                <input
                  type="date"
                  value={prescriptionDate}
                  onChange={e => setPrescriptionDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="drugs-header">
              <h2>Medications</h2>
              <button className="btn btn-outline" onClick={addDrug}>
                <Plus size={16} />
                Add Drug
              </button>
            </div>

            {drugs.map((drug, index) => (
              <div key={drug.id} className="drug-entry">
                <div className="drug-entry-header">
                  <span className="drug-number">Drug #{index + 1}</span>
                  {drugs.length > 1 && (
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => removeDrug(drug.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="drug-fields">
                  <div className="form-group full-width">
                    <label>Drug Name *</label>
                    <input
                      type="text"
                      value={drug.name}
                      onChange={e => updateDrug(drug.id, 'name', e.target.value)}
                      placeholder="e.g., Aspirin, Metformin"
                      className={`form-input ${errors[`${drug.id}-name`] ? 'error' : ''}`}
                      list={`drug-suggestions-${drug.id}`}
                    />
                    <datalist id={`drug-suggestions-${drug.id}`}>
                      {['Aspirin', 'Ibuprofen', 'Acetaminophen', 'Amoxicillin', 'Metformin',
                        'Lisinopril', 'Simvastatin', 'Warfarin', 'Metoprolol', 'Omeprazole',
                        'Atorvastatin', 'Ciprofloxacin', 'Digoxin', 'Furosemide', 'Amlodipine'].map(d => (
                        <option key={d} value={d} />
                      ))}
                    </datalist>
                    {errors[`${drug.id}-name`] && (
                      <span className="error-text">{errors[`${drug.id}-name`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Dosage *</label>
                    <input
                      type="number"
                      value={drug.dosage}
                      onChange={e => updateDrug(drug.id, 'dosage', e.target.value)}
                      placeholder="e.g., 500"
                      className={`form-input ${errors[`${drug.id}-dosage`] ? 'error' : ''}`}
                      min="0"
                      step="0.1"
                    />
                    {errors[`${drug.id}-dosage`] && (
                      <span className="error-text">{errors[`${drug.id}-dosage`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      value={drug.unit}
                      onChange={e => updateDrug(drug.id, 'unit', e.target.value)}
                      className="form-input"
                    >
                      {UNIT_OPTIONS.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={drug.frequency}
                      onChange={e => updateDrug(drug.id, 'frequency', e.target.value)}
                      className="form-input"
                    >
                      {FREQUENCY_OPTIONS.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Route</label>
                    <select
                      value={drug.route}
                      onChange={e => updateDrug(drug.id, 'route', e.target.value)}
                      className="form-input"
                    >
                      <option value="oral">Oral</option>
                      <option value="iv">Intravenous (IV)</option>
                      <option value="im">Intramuscular (IM)</option>
                      <option value="topical">Topical</option>
                      <option value="sublingual">Sublingual</option>
                      <option value="inhaled">Inhaled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={handleAnalyze}>
                <CheckCircle size={18} />
                Analyze Prescription
              </button>
            </div>
          </div>
        </div>

        <div className="results-panel">
          {results ? (
            <ValidationResults results={results} />
          ) : (
            <div className="results-placeholder">
              <CheckCircle size={64} color="#d1d5db" />
              <h3>Ready to Analyze</h3>
              <p>Fill in the prescription details and click "Analyze Prescription" to check for drug interactions and dosage anomalies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualEntry;
