import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bus, Users, Signal, ArrowRightCircle, MoreHorizontal, 
  Plus, Video, BarChart3, Route, Fuel, AlertTriangle
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { useAuth } from '../context/AuthContext';
import LiveMap from '../components/LiveMap';
import '../styles/Dashboard.css';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-card stat-card">
    <div className={`icon-container ${color}`}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <span className="stat-title">{title}</span>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { buses, drivers } = useFleet();
  const { user } = useAuth();
  
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission);
  };

  const totalBuses = buses.length;
  const onlineBuses = buses.filter(b => b.online).length;
  const totalStudents = buses.reduce((acc, b) => acc + b.totalStudents, 0);
  const maintenanceBuses = buses.filter(b => b.status === 'Maintenance').length;

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back, {user?.name || 'Controller'} 👋</h1>
          <p>Here's what's happening with your fleet today.</p>
        </div>
        <div className="welcome-stats">
          <div className="w-stat">
            <span className="w-stat-value">{onlineBuses}/{totalBuses}</span>
            <span className="w-stat-label">Buses Online</span>
          </div>
          <div className="w-stat">
            <span className="w-stat-value">{totalStudents}</span>
            <span className="w-stat-label">Students Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard title="Total Fleet" value={totalBuses} icon={Bus} color="accent" />
        <StatCard title="Online Now" value={onlineBuses} icon={Signal} color="green" />
        <StatCard title="Active Students" value={totalStudents} icon={Users} color="blue" />
        <StatCard title="Maintenance" value={maintenanceBuses} icon={AlertTriangle} color="orange" />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {hasPermission('manage_buses') && (
          <Link to="/add-bus" className="quick-action-btn" id="qa-add-bus">
            <Plus size={16} /> Add New Bus
          </Link>
        )}
        {hasPermission('manage_drivers') && (
          <Link to="/add-driver" className="quick-action-btn" id="qa-add-driver">
            <Plus size={16} /> Register Driver
          </Link>
        )}
        {hasPermission('manage_users') && (
          <Link to="/users" className="quick-action-btn" id="qa-add-user">
            <Plus size={16} /> Add Student/User
          </Link>
        )}
        {hasPermission('view_livestream') && (
          <Link to="/live-stream" className="quick-action-btn" id="qa-live-stream">
            <Video size={16} /> Live Stream
          </Link>
        )}
        {hasPermission('view_analytics') && (
          <Link to="/analytics" className="quick-action-btn" id="qa-analytics">
            <BarChart3 size={16} /> View Analytics
          </Link>
        )}
      </div>

      {/* Real-time Map */}
      <LiveMap />

      {/* Active Routes Table */}
      <div className="glass-card table-section">
        <div className="table-header">
          <div className="title-group">
            <h2>Active Routes</h2>
            <span className="subtitle">Live status of all running buses</span>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/analytics')}>
            <BarChart3 size={14} /> View Analytics
          </button>
        </div>
        
        <div className="table-container">
          <table id="routes-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Journey Path</th>
                <th>Current Status</th>
                <th>Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td>
                    <span className="route-badge">{bus.routeNumber}</span>
                  </td>
                  <td>
                    <div className="route-path">
                      <span className="location">{bus.from}</span>
                      <MoreHorizontal size={14} className="separator" />
                      <span className="location">{bus.to}</span>
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-pill ${bus.status.toLowerCase()}`}>
                        {bus.status}
                      </span>
                      {bus.online && <span className="speed-text">{bus.speed}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="student-pill">
                      <Users size={14} />
                      <strong>{bus.totalStudents}</strong>
                      <span className="muted">/ 50</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="action-icon-btn" 
                      onClick={() => navigate(`/bus/${bus.id}`)}
                      title="View Complete Details"
                      id={`view-bus-${bus.id}`}
                    >
                      <ArrowRightCircle size={20} color="var(--accent)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
