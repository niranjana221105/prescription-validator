import React, { useState, useEffect } from 'react';
import {
  CheckCircle, AlertTriangle, XCircle, Pill, Activity,
  Baby, ChevronDown, ChevronUp, Trash2, Pencil, Check, X, RefreshCw
} from 'lucide-react';
import AlertCard from './AlertCard';
import { analyzePrescription } from '../utils/drugInteractionChecker';
import './ValidationResults.css';

const UNIT_OPTIONS = ['mg', 'mcg', 'g', 'ml', 'units'];
const FREQ_OPTIONS = [
  { value: '0.5', label: 'Every other day' },
  { value: '1',   label: 'Once daily' },
  { value: '2',   label: 'Twice daily' },
  { value: '3',   label: 'Three times daily' },
  { value: '4',   label: 'Four times daily' },
];
const DRUG_SUGGESTIONS = [
  'Aspirin','Ibuprofen','Acetaminophen','Paracetamol','Amoxicillin',
  'Metformin','Lisinopril','Simvastatin','Warfarin','Metoprolol',
  'Omeprazole','Atorvastatin','Ciprofloxacin','Digoxin','Furosemide',
  'Amlodipine','Losartan','Gabapentin','Sertraline','Fluoxetine',
];

/* ─── Risk badge ─────────────────────────────────────────────────── */
const RiskBadge = ({ level }) => {
  const config = {
    safe:     { color: 'green',  label: 'SAFE',     icon: CheckCircle },
    warning:  { color: 'yellow', label: 'WARNING',  icon: AlertTriangle },
    critical: { color: 'red',    label: 'CRITICAL', icon: XCircle },
    info:     { color: 'blue',   label: 'INFO',     icon: Activity },
    danger:   { color: 'red',    label: 'ERROR',    icon: XCircle },
  };
  const { color, label, icon: Icon } = config[level] || config.info;
  return (
    <div className={`risk-badge risk-${color}`}>
      <Icon size={16} /><span>{label}</span>
    </div>
  );
};

/* ─── Age warning card ───────────────────────────────────────────── */
const AgeWarningCard = ({ warning }) => {
  const [open, setOpen] = useState(false);
  const isCritical = warning.severity === 'critical';
  return (
    <div className={`age-warning-card age-warning-${isCritical ? 'critical' : 'warning'}`}>
      <div className="age-warning-header" onClick={() => setOpen(o => !o)}>
        <div className="age-warning-left">
          {isCritical ? <XCircle size={18} /> : <AlertTriangle size={18} />}
          <div>
            <span className="age-warning-drug">{warning.drug}</span>
            <span className="age-warning-group">{warning.ageGroup}</span>
          </div>
        </div>
        <button className="age-warning-toggle" aria-label="toggle details">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <p className="age-warning-message">{warning.message}</p>
      {open && warning.description && (
        <div className="age-warning-description">
          <strong>Clinical guidance:</strong>
          <p>{warning.description}</p>
        </div>
      )}
    </div>
  );
};

/* ─── Editable drug row ──────────────────────────────────────────── */
const DrugRow = ({ drug, onDelete, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...drug });

  const handleSave = () => {
    if (!draft.name.trim() || !draft.dosage) return;
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...drug });
    setEditing(false);
  };

  const uid = `dr-${drug.name}-${drug.dosage}`;

  return (
    <div className={`drug-item ${editing ? 'drug-item-editing' : ''}`}>
      {editing ? (
        /* ── Edit mode ── */
        <div className="drug-edit-form">
          <div className="drug-edit-row">
            {/* Name */}
            <div className="drug-edit-field drug-edit-wide">
              <label>Drug Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="drug-edit-input"
                list={`${uid}-suggestions`}
                placeholder="e.g. Paracetamol"
              />
              <datalist id={`${uid}-suggestions`}>
                {DRUG_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            {/* Dosage */}
            <div className="drug-edit-field">
              <label>Dosage</label>
              <input
                type="number"
                value={draft.dosage}
                onChange={e => setDraft(d => ({ ...d, dosage: e.target.value }))}
                className="drug-edit-input"
                min="0" step="0.1"
                placeholder="500"
              />
            </div>
            {/* Unit */}
            <div className="drug-edit-field">
              <label>Unit</label>
              <select
                value={draft.unit || 'mg'}
                onChange={e => setDraft(d => ({ ...d, unit: e.target.value }))}
                className="drug-edit-input"
              >
                {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {/* Frequency */}
            <div className="drug-edit-field">
              <label>Frequency</label>
              <select
                value={String(draft.frequency || '1')}
                onChange={e => setDraft(d => ({ ...d, frequency: e.target.value }))}
                className="drug-edit-input"
              >
                {FREQ_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
          <div className="drug-edit-actions">
            <button className="drug-action-btn drug-save-btn" onClick={handleSave} title="Save">
              <Check size={14} /> Save
            </button>
            <button className="drug-action-btn drug-cancel-btn" onClick={handleCancel} title="Cancel">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <>
          <div className="drug-info">
            <div className="drug-name-row">
              <span className="drug-name">{drug.name}</span>
              {drug.nameValidation?.status === 'auto_corrected' && (
                <span className="drug-badge drug-badge-corrected" title={`Auto-corrected from "${drug.originalName}"`}>
                  Auto-corrected from "{drug.originalName}"
                </span>
              )}
              {drug.nameValidation?.status === 'invalid' && drug.nameValidation.suggestions?.length > 0 && (
                <span className="drug-badge drug-badge-warning">
                  Unrecognised
                </span>
              )}
            </div>
            <span className="drug-dosage">
              {drug.dosage} {drug.unit || 'mg'}
              {parseFloat(drug.frequency) > 1 ? ` × ${drug.frequency}/day` : '/day'}
            </span>
            {drug.nameValidation?.status === 'invalid' && drug.nameValidation.suggestions?.length > 0 && (
              <div className="drug-suggestions-hint">
                Did you mean: <strong>{drug.nameValidation.suggestions.join(', ')}</strong>?
              </div>
            )}
          </div>
          <div className="drug-row-right">
            {drug.dosageValidation?.issues?.length > 0 && (
              <div className="drug-issues">
                {drug.dosageValidation.issues.map((issue, i) => (
                  <span key={i} className={`issue-badge issue-${issue.severity}`}>
                    {issue.type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            <div className="drug-row-btns">
              <button
                className="drug-action-btn drug-edit-btn"
                onClick={() => { setDraft({ ...drug }); setEditing(true); }}
                title="Edit this drug"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                className="drug-action-btn drug-delete-btn"
                onClick={() => onDelete(drug)}
                title="Remove this drug"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────── */
const ValidationResults = ({ results, onResultsChange }) => {
  const [localDrugs, setLocalDrugs] = useState([]);
  const [localResults, setLocalResults] = useState(null);
  const [dirty, setDirty] = useState(false); // true when drugs edited but not re-analyzed

  // Sync when results prop changes (new scan / new analysis)
  useEffect(() => {
    if (results) {
      setLocalDrugs(results.drugs || []);
      setLocalResults(results);
      setDirty(false);
    }
  }, [results]);

  if (!localResults) return null;

  const { interactions = [], ageWarnings = [], alerts = [], riskLevel, summary, patientAge } = localResults;

  /* Delete a drug */
  const handleDelete = (drugToRemove) => {
    const updated = localDrugs.filter(d => d !== drugToRemove);
    setLocalDrugs(updated);
    setDirty(true);
  };

  /* Save an edited drug */
  const handleSave = (original, edited) => {
    const updated = localDrugs.map(d => d === original ? { ...d, ...edited } : d);
    setLocalDrugs(updated);
    setDirty(true);
  };

  /* Re-run analysis with current drug list */
  const handleReanalyze = () => {
    if (localDrugs.length === 0) {
      const empty = {
        drugs: [], interactions: [], ageWarnings: [], alerts: [],
        riskLevel: 'info',
        summary: 'No medications remaining. Add drugs via the manual entry panel.',
        patientAge,
      };
      setLocalResults(empty);
      setDirty(false);
      onResultsChange?.(empty);
      return;
    }
    const fresh = analyzePrescription(localDrugs, patientAge ?? null);
    setLocalResults({ ...fresh, patientAge });
    setLocalDrugs(fresh.drugs);
    setDirty(false);
    onResultsChange?.(fresh);
  };

  return (
    <div className="validation-results">
      <div className="results-header">
        <h2>Validation Results</h2>
        <RiskBadge level={riskLevel} />
      </div>

      <div className={`summary-box summary-${riskLevel}`}>
        <p>{summary}</p>
      </div>

      {/* Age warnings */}
      {ageWarnings.length > 0 && (
        <div className="results-section">
          <h3><Baby size={18} /> Age-Based Warnings ({ageWarnings.length})</h3>
          <div className="age-warnings-list">
            {ageWarnings.map((w, i) => <AgeWarningCard key={i} warning={w} />)}
          </div>
          {patientAge != null && patientAge !== '' && (
            <p className="age-note">
              Checked for patient aged <strong>{patientAge} year{parseFloat(patientAge) !== 1 ? 's' : ''}</strong>.
            </p>
          )}
        </div>
      )}

      {/* Detected medications with edit / delete */}
      {localDrugs.length > 0 && (
        <div className="results-section">
          <div className="section-header-row">
            <h3><Pill size={18} /> Detected Medications ({localDrugs.length})</h3>
            {dirty && (
              <button className="reanalyze-btn" onClick={handleReanalyze}>
                <RefreshCw size={14} /> Re-analyze
              </button>
            )}
          </div>

          {dirty && (
            <div className="dirty-notice">
              Medications changed — click <strong>Re-analyze</strong> to update results.
            </div>
          )}

          <div className="drugs-list">
            {localDrugs.map((drug, index) => (
              <DrugRow
                key={index}
                drug={drug}
                onDelete={(d) => handleDelete(d)}
                onSave={(edited) => handleSave(drug, edited)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drug interactions */}
      {interactions.length > 0 && (
        <div className="results-section">
          <h3><AlertTriangle size={18} /> Drug Interactions ({interactions.length})</h3>
          {interactions.map((interaction, index) => (
            <AlertCard
              key={index}
              type={interaction.severity === 'critical' ? 'danger' : 'warning'}
              title={`${interaction.drug1} + ${interaction.drug2}`}
              message={interaction.effect}
            />
          ))}
        </div>
      )}

      {/* All alerts */}
      {alerts.length > 0 && (
        <div className="results-section">
          <h3>All Alerts ({alerts.length})</h3>
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <AlertTriangle size={14} />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {localDrugs.length === 0 && interactions.length === 0 && (
        <div className="no-data">
          <p>No medication data to display</p>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;
