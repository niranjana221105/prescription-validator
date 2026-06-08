import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Edit3, CheckCircle } from 'lucide-react';
import './ManualDrugEntry.css';

const FREQUENCY_OPTIONS = [
  { value: '1',   label: 'Once daily (OD)' },
  { value: '2',   label: 'Twice daily (BID)' },
  { value: '3',   label: 'Three times daily (TID)' },
  { value: '4',   label: 'Four times daily (QID)' },
  { value: '0.5', label: 'Every other day' },
];

const UNIT_OPTIONS = ['mg', 'mcg', 'g', 'ml', 'units'];

const DRUG_SUGGESTIONS = [
  'Aspirin','Ibuprofen','Acetaminophen','Paracetamol','Amoxicillin',
  'Metformin','Lisinopril','Simvastatin','Warfarin','Metoprolol',
  'Omeprazole','Atorvastatin','Ciprofloxacin','Digoxin','Furosemide',
  'Amlodipine','Losartan','Gabapentin','Sertraline','Fluoxetine',
];

const emptyDrug = () => ({
  id: Date.now() + Math.random(),
  name: '',
  dosage: '',
  unit: 'mg',
  frequency: '1',
  route: 'oral',
});

/**
 * Reusable manual drug entry panel.
 *
 * Props:
 *   onAnalyze(drugs)  – called when user clicks "Analyze Manually"
 *   defaultOpen       – whether the panel starts expanded (default false)
 *   title             – heading text (optional)
 *   subtitle          – subheading text (optional)
 */
const ManualDrugEntry = ({
  onAnalyze,
  defaultOpen = false,
  title = 'Enter Medications Manually',
  subtitle = 'Add drugs below if they were not detected automatically',
}) => {
  const [open, setOpen]     = useState(defaultOpen);
  const [drugs, setDrugs]   = useState([emptyDrug()]);
  const [errors, setErrors] = useState({});

  const addDrug = () => setDrugs(prev => [...prev, emptyDrug()]);

  const removeDrug = (id) => setDrugs(prev => prev.filter(d => d.id !== id));

  const updateDrug = (id, field, value) => {
    setDrugs(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    setErrors(prev => ({ ...prev, [`${id}-${field}`]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;
    drugs.forEach(drug => {
      if (!drug.name.trim()) {
        newErrors[`${drug.id}-name`] = 'Required';
        valid = false;
      }
      if (!drug.dosage || isNaN(parseFloat(drug.dosage))) {
        newErrors[`${drug.id}-dosage`] = 'Required';
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleAnalyze = () => {
    if (!validate()) return;
    onAnalyze(drugs);
  };

  const handleReset = () => {
    setDrugs([emptyDrug()]);
    setErrors({});
  };

  return (
    <div className={`mde-panel ${open ? 'mde-open' : ''}`}>
      {/* ── Header / toggle ── */}
      <button className="mde-toggle" onClick={() => setOpen(o => !o)}>
        <div className="mde-toggle-left">
          <Edit3 size={18} />
          <div>
            <span className="mde-toggle-title">{title}</span>
            <span className="mde-toggle-sub">{subtitle}</span>
          </div>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* ── Body ── */}
      {open && (
        <div className="mde-body">
          {drugs.map((drug, index) => (
            <div key={drug.id} className="mde-drug-row">
              <div className="mde-drug-header">
                <span className="mde-drug-label">Drug #{index + 1}</span>
                {drugs.length > 1 && (
                  <button
                    className="mde-remove-btn"
                    onClick={() => removeDrug(drug.id)}
                    title="Remove drug"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="mde-fields">
                {/* Drug name */}
                <div className="mde-field mde-field-wide">
                  <label>Drug Name *</label>
                  <input
                    type="text"
                    value={drug.name}
                    onChange={e => updateDrug(drug.id, 'name', e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className={`mde-input ${errors[`${drug.id}-name`] ? 'mde-input-error' : ''}`}
                    list={`mde-suggestions-${drug.id}`}
                  />
                  <datalist id={`mde-suggestions-${drug.id}`}>
                    {DRUG_SUGGESTIONS.map(d => <option key={d} value={d} />)}
                  </datalist>
                  {errors[`${drug.id}-name`] && (
                    <span className="mde-error-text">{errors[`${drug.id}-name`]}</span>
                  )}
                </div>

                {/* Dosage */}
                <div className="mde-field">
                  <label>Dosage *</label>
                  <input
                    type="number"
                    value={drug.dosage}
                    onChange={e => updateDrug(drug.id, 'dosage', e.target.value)}
                    placeholder="e.g. 500"
                    className={`mde-input ${errors[`${drug.id}-dosage`] ? 'mde-input-error' : ''}`}
                    min="0"
                    step="0.1"
                  />
                  {errors[`${drug.id}-dosage`] && (
                    <span className="mde-error-text">{errors[`${drug.id}-dosage`]}</span>
                  )}
                </div>

                {/* Unit */}
                <div className="mde-field">
                  <label>Unit</label>
                  <select
                    value={drug.unit}
                    onChange={e => updateDrug(drug.id, 'unit', e.target.value)}
                    className="mde-input"
                  >
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                {/* Frequency */}
                <div className="mde-field">
                  <label>Frequency</label>
                  <select
                    value={drug.frequency}
                    onChange={e => updateDrug(drug.id, 'frequency', e.target.value)}
                    className="mde-input"
                  >
                    {FREQUENCY_OPTIONS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Route */}
                <div className="mde-field">
                  <label>Route</label>
                  <select
                    value={drug.route}
                    onChange={e => updateDrug(drug.id, 'route', e.target.value)}
                    className="mde-input"
                  >
                    <option value="oral">Oral</option>
                    <option value="iv">IV</option>
                    <option value="im">IM</option>
                    <option value="topical">Topical</option>
                    <option value="sublingual">Sublingual</option>
                    <option value="inhaled">Inhaled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="mde-actions">
            <button className="mde-btn mde-btn-outline" onClick={addDrug}>
              <Plus size={15} />
              Add Drug
            </button>
            <div className="mde-actions-right">
              <button className="mde-btn mde-btn-ghost" onClick={handleReset}>
                Reset
              </button>
              <button className="mde-btn mde-btn-primary" onClick={handleAnalyze}>
                <CheckCircle size={15} />
                Analyze Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualDrugEntry;
