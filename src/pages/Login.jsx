import React, { useState } from 'react';
import { Activity, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, register } = useAuth();
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'doctor', hospital: ''
  });

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <Activity size={36} color="#3b82f6" />
          <h1>MediSafe</h1>
          <p>Smart Prescription Validator</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Name — register only */}
          {mode === 'register' && (
            <div className="login-field">
              <label><User size={15} /> Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Dr. John Smith"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <label><Mail size={15} /> Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label><Lock size={15} /> Password</label>
            <div className="pwd-wrap">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(s => !s)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role + Hospital — register only */}
          {mode === 'register' && (
            <>
              <div className="login-field">
                <label>Role</label>
                <select value={form.role} onChange={set('role')}>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="login-field">
                <label><Building2 size={15} /> Hospital / Clinic (optional)</label>
                <input
                  type="text"
                  value={form.hospital}
                  onChange={set('hospital')}
                  placeholder="City General Hospital"
                />
              </div>
            </>
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="login-footer">
          {mode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            className="login-switch"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
