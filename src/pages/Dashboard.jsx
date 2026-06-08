import React, { useMemo } from 'react';
import { FileText, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import AlertCard from '../components/AlertCard';
import './Dashboard.css';

const Dashboard = ({ prescriptions }) => {
  const stats = useMemo(() => {
    const total = prescriptions.length;
    const safe = prescriptions.filter(p => p.riskLevel === 'safe').length;
    const warnings = prescriptions.filter(p => p.riskLevel === 'warning').length;
    const critical = prescriptions.filter(p => p.riskLevel === 'critical').length;

    return { total, safe, warnings, critical };
  }, [prescriptions]);

  const recentAlerts = useMemo(() => {
    return prescriptions
      .filter(p => p.riskLevel !== 'safe')
      .slice(0, 5);
  }, [prescriptions]);

  const chartData = [
    { name: 'Safe', value: stats.safe, color: '#10b981' },
    { name: 'Warning', value: stats.warnings, color: '#f59e0b' },
    { name: 'Critical', value: stats.critical, color: '#ef4444' }
  ];

  const weeklyData = [
    { day: 'Mon', scans: 12, alerts: 3 },
    { day: 'Tue', scans: 19, alerts: 5 },
    { day: 'Wed', scans: 15, alerts: 2 },
    { day: 'Thu', scans: 22, alerts: 7 },
    { day: 'Fri', scans: 18, alerts: 4 },
    { day: 'Sat', scans: 8, alerts: 1 },
    { day: 'Sun', scans: 5, alerts: 0 }
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time prescription validation overview</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={FileText}
          title="Total Prescriptions"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Safe Prescriptions"
          value={stats.safe}
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Warnings"
          value={stats.warnings}
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          title="Critical Alerts"
          value={stats.critical}
          color="red"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="scans" fill="#3b82f6" name="Scans" />
              <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {chartData.map((entry, index) => (
              <div key={index} className="pie-legend-item">
                <span className="pie-legend-dot" style={{ background: entry.color }} />
                <span className="pie-legend-label">{entry.name}</span>
                <span className="pie-legend-value">{entry.value} ({stats.total > 0 ? ((entry.value / stats.total) * 100).toFixed(0) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-alerts">
        <h2>Recent Alerts</h2>
        {recentAlerts.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="#10b981" />
            <p>No alerts at this time. All prescriptions are safe!</p>
          </div>
        ) : (
          recentAlerts.map((prescription) => (
            <AlertCard
              key={prescription.id}
              type={prescription.riskLevel === 'critical' ? 'danger' : 'warning'}
              title={`Prescription #${prescription.id}`}
              message={prescription.alerts?.[0] || 'Drug interaction detected'}
              details={prescription.interactions}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
