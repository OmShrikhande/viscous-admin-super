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

  const hasPermission = (permission) => {
    if (!user) return false;
    // Super admins have all permissions
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission);
  };

  const isExpired = user?.planExpired;

  return (
    <aside className={`sidebar ${isExpired ? 'sidebar-locked' : ''}`} id="main-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Bus size={22} />
        </div>
        <span>Viscous</span>
      </div>

      <nav className="sidebar-nav">
        {!isExpired && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              id="nav-dashboard"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            {hasPermission('view_analytics') && (
              <NavLink
                to="/analytics"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-analytics"
              >
                <BarChart3 size={20} />
                <span>Analytics</span>
                <span className="nav-badge">New</span>
              </NavLink>
            )}

            {hasPermission('view_livestream') && (
              <NavLink
                to="/live-stream"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-live-stream"
              >
                <Video size={20} />
                <span>Live Stream</span>
                <span className="nav-badge success">Live</span>
              </NavLink>
            )}

            {(hasPermission('manage_buses') || hasPermission('manage_routes')) && (
              <div className="nav-label">Fleet Management</div>
            )}

            {hasPermission('manage_buses') && (
              <NavLink
                to="/add-bus"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-add-bus"
              >
                <Bus size={20} />
                <span>Add Bus</span>
              </NavLink>
            )}

            {hasPermission('manage_routes') && (
              <NavLink
                to="/manage-routes"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-routes"
              >
                <Route size={20} />
                <span>Manage Routes</span>
              </NavLink>
            )}

            {(hasPermission('manage_drivers') || hasPermission('manage_users')) && (
              <div className="nav-label">People</div>
            )}

            {hasPermission('manage_drivers') && (
              <NavLink
                to="/add-driver"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-add-driver"
              >
                <UserCheck size={20} />
                <span>Add Driver</span>
              </NavLink>
            )}

            {hasPermission('manage_users') && (
              <NavLink
                to="/users"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-users"
              >
                <Users size={20} />
                <span>Users & Students</span>
              </NavLink>
            )}

            <div className="nav-label">System</div>

            {hasPermission('manage_notifications') && (
              <NavLink
                to="/notifications"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-notifications"
              >
                <Bell size={20} />
                <span>Notifications</span>
                <span className="nav-badge warning">3</span>
              </NavLink>
            )}

            {hasPermission('manage_settings') && (
              <NavLink
                to="/settings"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                id="nav-settings"
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            )}
          </>
        )}

        {isExpired && (
          <NavLink
            to="/plan-expired"
            className="nav-item active"
            style={{ marginTop: '20px' }}
          >
            <ShieldCheck size={20} />
            <span>Renew Plan</span>
          </NavLink>
        )}
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
