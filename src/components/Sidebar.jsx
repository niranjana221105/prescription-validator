import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Edit, Upload, History, Activity, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ backendOnline }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/live-scanner', icon: Camera,           label: 'Live Scanner' },
    { path: '/manual-entry', icon: Edit,             label: 'Manual Entry' },
    { path: '/upload',       icon: Upload,           label: 'Upload Prescription' },
    { path: '/history',      icon: History,          label: 'History' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Activity className="logo-icon" />
        <h1 className="sidebar-title">MediSafe</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* DB status */}
        <div className="db-status">
          {backendOnline
            ? <><Wifi size={13} color="#34d399" /> <span style={{color:'#34d399'}}>DB Connected</span></>
            : <><WifiOff size={13} color="#f87171" /> <span style={{color:'#f87171'}}>Offline Mode</span></>
          }
        </div>
        {/* User info */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-role">{user.role}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        )}
        <p className="version">v2.0.0 — Full Stack</p>
      </div>
    </aside>
  );
};

export default Sidebar;
