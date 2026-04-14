import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bus, MapPin, UserPlus, UserCheck, Settings, LogOut,
  BarChart3, Users, Video, Bell, Route, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" id="main-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Bus size={22} />
        </div>
        <span>Viscous</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-dashboard"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-analytics"
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
          <span className="nav-badge">New</span>
        </NavLink>

        <NavLink
          to="/live-stream"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-live-stream"
        >
          <Video size={20} />
          <span>Live Stream</span>
          <span className="nav-badge success">Live</span>
        </NavLink>

        <div className="nav-label">Fleet Management</div>

        <NavLink
          to="/add-bus"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-add-bus"
        >
          <Bus size={20} />
          <span>Add Bus</span>
        </NavLink>

        <NavLink
          to="/manage-routes"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-routes"
        >
          <Route size={20} />
          <span>Manage Routes</span>
        </NavLink>

        <div className="nav-label">People</div>

        <NavLink
          to="/add-driver"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-add-driver"
        >
          <UserCheck size={20} />
          <span>Add Driver</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-users"
        >
          <Users size={20} />
          <span>Users & Students</span>
        </NavLink>

        <div className="nav-label">System</div>

        <NavLink
          to="/notifications"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-notifications"
        >
          <Bell size={20} />
          <span>Notifications</span>
          <span className="nav-badge warning">3</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          id="nav-settings"
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.avatar || 'CT'}</div>
          <div className="details">
            <span className="name">{user?.name || 'Controller'}</span>
            <span className="role">{user?.role || 'Fleet Manager'}</span>
          </div>
        </div>
        <button className="logout-btn" title="Logout" id="btn-logout" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
