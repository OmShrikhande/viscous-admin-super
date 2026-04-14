import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Star, Shield, Clock, MapPin, BarChart3, TrendingUp, Calendar, Activity } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import HistoryMap from '../components/HistoryMap';
import '../styles/BusDetail.css';

const BusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buses, drivers } = useFleet();

  const bus = buses.find(b => b.id === id);
  const driver = drivers.find(d => d.id === bus?.driverId);

  // History state
  const historyDates = bus?.routeHistory ? Object.keys(bus.routeHistory).sort().reverse() : [];
  const [selectedDate, setSelectedDate] = useState(historyDates[0] || '');
  const currentPath = bus?.routeHistory ? bus.routeHistory[selectedDate] : [];

  if (!bus) return (
    <div className="bus-detail-page">
      <div className="empty-state">
        <h3>Bus not found</h3>
        <p>The bus you're looking for doesn't exist.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="bus-detail-page">
      <button className="back-btn" onClick={() => navigate('/')} id="btn-back">
        <ArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      <div className="detail-header">
        <div className="bus-title">
          <h1>Bus {bus.id} <span className="route-text">| {bus.routeNumber}</span></h1>
          <div className="status-row">
            <span className={`status-pill ${bus.status.toLowerCase()}`}>{bus.status}</span>
            <span className="online-indicator">
              <span className={`dot ${bus.online ? 'online' : 'offline'}`}></span>
              {bus.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="quick-stats">
          <div className="q-stat">
            <span className="label">Speed</span>
            <span className="value">{bus.speed}</span>
          </div>
          <div className="q-stat">
            <span className="label">Fuel</span>
            <span className="value">{bus.fuel}</span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Driver Section */}
        <section className="glass-card driver-section">
          <div className="section-head">
            <User size={18} className="accent-icon" />
            <h2>Driver Information</h2>
          </div>
          {driver ? (
            <>
              <div className="driver-card">
                <img src={driver.image} alt={driver.name} className="driver-img" />
                <div className="driver-info">
                  <h3>{driver.name}</h3>
                  <p className="experience">{driver.experience} Experience</p>
                  <div className="rating">
                    <Star size={13} fill="currentColor" />
                    <span>{driver.rating}</span>
                    <span className="count">(120 Reviews)</span>
                  </div>
                </div>
              </div>
              <div className="driver-actions">
                <button className="contact-btn">
                  <Phone size={16} />
                  Call Driver
                </button>
                <button className="verify-btn">
                  <Shield size={16} />
                  Verified
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No driver assigned</p>
          )}
        </section>

        {/* Route Breakdown */}
        <section className="glass-card route-section">
          <div className="section-head">
            <MapPin size={18} className="accent-icon" />
            <h2>Route Breakdown</h2>
          </div>
          <div className="stop-list">
            {bus.stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <div className="stop-time">
                  <Clock size={12} />
                  <span>{stop.time}</span>
                </div>
                <div className="stop-details">
                  <span className="stop-name">{stop.name}</span>
                  <span className="stop-students">{stop.students} Students</span>
                </div>
                {index !== bus.stops.length - 1 && <div className="stop-line"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Stats */}
        <section className="glass-card stats-section">
          <div className="section-head">
            <BarChart3 size={18} className="accent-icon" />
            <h2>Daily Attendance</h2>
          </div>
          <div className="attendance-grid">
            <div className="att-card">
              <span className="label">Morning Entry</span>
              <span className="time">{bus.attendance.morning.in}</span>
              <span className="sub">{bus.attendance.morning.count} Students boarded</span>
            </div>
            <div className="att-card">
              <span className="label">Morning Exit</span>
              <span className="time">{bus.attendance.morning.out}</span>
              <span className="sub">Arrived at University</span>
            </div>
            <div className="att-card">
              <span className="label">Evening Entry</span>
              <span className="time">{bus.attendance.evening.in}</span>
              <span className="sub">{bus.attendance.evening.count} Students boarded</span>
            </div>
            <div className="att-card">
              <span className="label">Evening Exit</span>
              <span className="time">{bus.attendance.evening.out}</span>
              <span className="sub">Last student dropped</span>
            </div>
          </div>
        </section>

        {/* Frequency & Activity */}
        <section className="glass-card activity-section">
          <div className="section-head">
            <TrendingUp size={18} className="accent-icon" />
            <h2>Operational Activity</h2>
          </div>
          <div className="freq-box">
            <div className="freq-value">{bus.tripsPerDay}</div>
            <div className="freq-label">Trips Per Day</div>
          </div>
          <div className="activity-chart-placeholder">
            <div className="chart-bar" style={{height: '60%'}}></div>
            <div className="chart-bar" style={{height: '80%'}}></div>
            <div className="chart-bar" style={{height: '40%'}}></div>
            <div className="chart-bar" style={{height: '90%'}}></div>
            <div className="chart-bar" style={{height: '70%'}}></div>
          </div>
        </section>
      </div>

      {/* Route History Section */}
      <section className="glass-card history-section-full">
        <div className="section-head-main">
          <div className="header-left">
            <Activity size={22} className="accent-icon" />
            <div>
              <h2>Route History</h2>
              <p className="subtitle">Visualizing traveled paths and geo-breadcrumbs</p>
            </div>
          </div>
          <div className="date-selector">
            <Calendar size={16} />
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="history-select"
              id="date-selector"
            >
              {historyDates.length > 0 ? (
                historyDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))
              ) : (
                <option value="">No history available</option>
              )}
            </select>
          </div>
        </div>

        <div className="history-content-grid">
          <div className="map-column">
            <HistoryMap path={currentPath} />
          </div>
          <div className="history-stats-column">
            <div className="h-stat-card">
              <span className="h-label">Total Distance</span>
              <span className="h-value">12.4 km</span>
            </div>
            <div className="h-stat-card">
              <span className="h-label">Avg. Speed</span>
              <span className="h-value">38 km/h</span>
            </div>
            <div className="h-stat-card">
              <span className="h-label">Start Time</span>
              <span className="h-value">07:45 AM</span>
            </div>
            <div className="h-stat-card">
              <span className="h-label">End Time</span>
              <span className="h-value">09:15 AM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusDetail;
