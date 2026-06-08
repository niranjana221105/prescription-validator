import React, { useState, useMemo } from 'react';
import { Search, Filter, FileText, Camera, Upload, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import ValidationResults from '../components/ValidationResults';
import './History.css';

const sourceIcons = {
  'live-scan': Camera,
  'upload': Upload,
  'manual': Edit
};

const sourceLabels = {
  'live-scan': 'Live Scan',
  'upload': 'Upload',
  'manual': 'Manual Entry'
};

const riskColors = {
  safe: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444'
};

const HistoryItem = ({ prescription }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = sourceIcons[prescription.source] || FileText;
  const date = new Date(prescription.timestamp);

  return (
    <div className={`history-item risk-border-${prescription.riskLevel}`}>
      <div className="history-item-header" onClick={() => setExpanded(!expanded)}>
        <div className="history-item-left">
          <div className="source-icon">
            <Icon size={18} />
          </div>
          <div className="history-item-info">
            <div className="history-item-title">
              {prescription.patientName || `Prescription #${prescription.id}`}
              <span className="source-label">{sourceLabels[prescription.source]}</span>
            </div>
            <div className="history-item-meta">
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
              {prescription.drugs?.length > 0 && (
                <span> · {prescription.drugs.length} medication(s)</span>
              )}
            </div>
          </div>
        </div>

        <div className="history-item-right">
          <span
            className="risk-pill"
            style={{ background: `${riskColors[prescription.riskLevel]}20`, color: riskColors[prescription.riskLevel] }}
          >
            {prescription.riskLevel?.toUpperCase()}
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="history-item-details">
          <ValidationResults results={prescription} />
        </div>
      )}
    </div>
  );
};

const History = ({ prescriptions }) => {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  const filtered = useMemo(() => {
    return prescriptions.filter(p => {
      const matchesSearch = !search ||
        p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        p.drugs?.some(d => d.name.toLowerCase().includes(search.toLowerCase()));

      const matchesRisk = filterRisk === 'all' || p.riskLevel === filterRisk;
      const matchesSource = filterSource === 'all' || p.source === filterSource;

      return matchesSearch && matchesRisk && matchesSource;
    });
  }, [prescriptions, search, filterRisk, filterSource]);

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Prescription History</h1>
        <p>View and search all previously validated prescriptions</p>
      </div>

      <div className="history-filters">
        <div className="search-box">
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by patient name or drug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} color="#6b7280" />
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Risk Levels</option>
            <option value="safe">Safe</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sources</option>
            <option value="live-scan">Live Scan</option>
            <option value="upload">Upload</option>
            <option value="manual">Manual Entry</option>
          </select>
        </div>
      </div>

      <div className="history-stats">
        <span>{filtered.length} of {prescriptions.length} records</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-history">
          <FileText size={64} color="#d1d5db" />
          <h3>No Records Found</h3>
          <p>
            {prescriptions.length === 0
              ? 'No prescriptions have been validated yet. Use the Live Scanner, Manual Entry, or Upload to get started.'
              : 'No records match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map(prescription => (
            <HistoryItem key={prescription.id} prescription={prescription} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
