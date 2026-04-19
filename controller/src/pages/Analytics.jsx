import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Bus, Users, Clock, Fuel,
  CheckCircle, AlertTriangle, MapPin, Activity
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import '../styles/Analytics.css';

const Analytics = () => {
  const { buses, drivers } = useFleet();
  const [activeFilter, setActiveFilter] = useState('week');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('viscous_token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/controller/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalBuses = buses.length;
  const onlineBuses = buses.filter(b => b.online).length;
  const totalStudents = buses.reduce((acc, b) => acc + (b.totalStudents || 0), 0);
  const avgTrips = stats?.totalTrips || 0;

  const filters = ['today', 'week', 'month', 'year'];

  // Data from stats state or defaults
  const weekData = stats?.fuelConsumption?.weekly?.map((val, i) => ({
    day: stats.fuelConsumption.labels[i],
    trips: val
  })) || [
    { day: 'Mon', trips: 0 }, { day: 'Tue', trips: 0 }, { day: 'Wed', trips: 0 },
    { day: 'Thu', trips: 0 }, { day: 'Fri', trips: 0 }, { day: 'Sat', trips: 0 },
    { day: 'Sun', trips: 0 },
  ];
  
  const maxTrips = Math.max(...weekData.map(d => d.trips), 1);

  // Status distribution
  const statusDistribution = {
    moving: buses.filter(b => b.status === 'Moving').length,
    stopped: buses.filter(b => b.status === 'Stopped' || !b.status).length,
    maintenance: buses.filter(b => b.status === 'Maintenance').length,
  };

  const activities = [
    { icon: CheckCircle, type: 'success', title: 'System monitoring active', desc: 'All fleet nodes communicating', time: 'Just now' },
  ];

  // Donut chart as conic gradient
  const total = statusDistribution.moving + statusDistribution.stopped + statusDistribution.maintenance;
  const movingPct = total > 0 ? (statusDistribution.moving / total) * 100 : 0;
  const stoppedPct = total > 0 ? (statusDistribution.stopped / total) * 100 : 0;

  const donutStyle = {
    background: `conic-gradient(
      #22c55e 0% ${movingPct}%,
      #f59e0b ${movingPct}% ${movingPct + stoppedPct}%,
      #ef4444 ${movingPct + stoppedPct}% 100%
    )`,
    WebkitMask: 'radial-gradient(farthest-side, transparent 60%, black 61%)',
    mask: 'radial-gradient(farthest-side, transparent 60%, black 61%)',
  };

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>Fleet Analytics</h1>
        <p>Comprehensive insights into your fleet performance and operations.</p>
      </header>

      {/* Filter Bar */}
      <div className="analytics-filter-bar">
        {filters.map(f => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
            id={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="analytics-overview">
        <div className="glass-card overview-card">
          <div className="ov-header">
            <span className="ov-label">Total Trips</span>
            <span className="ov-trend up"><TrendingUp size={12} /> +12%</span>
          </div>
          <div className="ov-value">{weekData.reduce((a, b) => a + b.trips, 0)}</div>
          <div className="ov-sub">This {activeFilter}</div>
        </div>

        <div className="glass-card overview-card">
          <div className="ov-header">
            <span className="ov-label">Avg. Trips / Bus</span>
            <span className="ov-trend up"><TrendingUp size={12} /> +5%</span>
          </div>
          <div className="ov-value">{avgTrips}</div>
          <div className="ov-sub">Per day average</div>
        </div>

        <div className="glass-card overview-card">
          <div className="ov-header">
            <span className="ov-label">Fleet Uptime</span>
            <span className="ov-trend up"><TrendingUp size={12} /> +3%</span>
          </div>
          <div className="ov-value">{total > 0 ? Math.round((onlineBuses / total) * 100) : 0}%</div>
          <div className="ov-sub">{onlineBuses} of {totalBuses} buses online</div>
        </div>

        <div className="glass-card overview-card">
          <div className="ov-header">
            <span className="ov-label">Students Served</span>
            <span className="ov-trend down"><TrendingDown size={12} /> -2%</span>
          </div>
          <div className="ov-value">{totalStudents}</div>
          <div className="ov-sub">Across all routes</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="glass-card chart-card">
          <div className="chart-header">
            <span className="chart-title">Weekly Trip Distribution</span>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              Export
            </button>
          </div>
          <div className="bar-chart">
            {weekData.map((d, i) => (
              <div className="bar-column" key={i}>
                <span className="bar-value-label">{d.trips}</span>
                <div 
                  className="bar" 
                  style={{ height: `${(d.trips / maxTrips) * 100}%` }}
                ></div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="chart-header">
            <span className="chart-title">Fleet Status</span>
          </div>
          <div className="donut-chart-container">
            <div className="donut-chart" style={donutStyle}>
              <div className="donut-center">
                <span className="donut-center-value">{total}</span>
                <span className="donut-center-label">Total Buses</span>
              </div>
            </div>
            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#22c55e' }}></span>
                <span className="legend-label">Moving</span>
                <span className="legend-value">{statusDistribution.moving}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
                <span className="legend-label">Stopped</span>
                <span className="legend-value">{statusDistribution.stopped}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#ef4444' }}></span>
                <span className="legend-label">Maintenance</span>
                <span className="legend-value">{statusDistribution.maintenance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-section glass-card activity-feed">
        <div className="chart-header">
          <span className="chart-title">Recent Activity</span>
          <button className="btn-ghost">View All</button>
        </div>
        <div className="activity-list">
          {activities.map((act, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-icon ${act.type}`}>
                <act.icon size={18} />
              </div>
              <div className="activity-content">
                <div className="activity-title">{act.title}</div>
                <div className="activity-desc">{act.desc}</div>
              </div>
              <span className="activity-time">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
