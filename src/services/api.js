// Central API service — all backend calls go through here
// In development: Vite proxy forwards /api → localhost:5000
// In production (Vercel): same origin /api route

const BASE = '/api';

// ── Helper ────────────────────────────────────────────────────────────────────
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  me: () =>
    fetch(`${BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  updateProfile: (body) =>
    fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),
};

// ── Prescriptions ─────────────────────────────────────────────────────────────
export const prescriptionAPI = {
  save: (body) =>
    fetch(`${BASE}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return fetch(`${BASE}/prescriptions${qs ? '?' + qs : ''}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  stats: () =>
    fetch(`${BASE}/prescriptions/stats`, { headers: getHeaders() }).then(handleResponse),

  get: (id) =>
    fetch(`${BASE}/prescriptions/${id}`, { headers: getHeaders() }).then(handleResponse),

  updateNotes: (id, notes) =>
    fetch(`${BASE}/prescriptions/${id}/notes`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/prescriptions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientAPI = {
  create: (body) =>
    fetch(`${BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  list: (search = '') =>
    fetch(`${BASE}/patients${search ? '?search=' + search : ''}`, {
      headers: getHeaders()
    }).then(handleResponse),

  get: (id) =>
    fetch(`${BASE}/patients/${id}`, { headers: getHeaders() }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/patients/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
};

// ── Health check ──────────────────────────────────────────────────────────────
export const checkHealth = () =>
  fetch(`${BASE}/health`).then(handleResponse).catch(() => ({ status: 'offline' }));
