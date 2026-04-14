import React from 'react';
import { MapPin, Bus, Users, Clock, ArrowRight, Plus } from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const ManageRoutes = () => {
  const { buses } = useFleet();

  // Derive route data from buses
  const routes = buses.map(bus => ({
    id: bus.routeNumber,
    from: bus.from,
    to: bus.to,
    busId: bus.id,
    stops: bus.stops?.length || 0,
    students: bus.totalStudents,
    status: bus.status,
  }));

  return (
    <div className="routes-page">
      <header className="page-header">
        <h1>Manage Routes</h1>
        <p>View and manage all bus routes across your transportation network.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Link to="/add-bus" className="btn-primary" style={{ textDecoration: 'none' }} id="btn-add-route">
          <Plus size={16} /> Create New Route
        </Link>
      </div>

      <div className="routes-grid" id="routes-grid">
        {routes.map((route, i) => (
          <div className="glass-card route-card" key={i} id={`route-${route.id}`}>
            <div className="route-card-header">
              <span className="route-number">{route.id}</span>
              <span className={`status-pill ${route.status.toLowerCase()}`}>
                {route.status}
              </span>
            </div>
            <div className="route-card-body">
              <div className="route-stop-row">
                <MapPin size={16} />
                <span>{route.from}</span>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{route.to}</span>
              </div>
              <div className="route-meta">
                <div className="route-meta-item">
                  <Bus size={13} />
                  <strong>{route.busId}</strong>
                </div>
                <div className="route-meta-item">
                  <MapPin size={13} />
                  <strong>{route.stops}</strong> stops
                </div>
                <div className="route-meta-item">
                  <Users size={13} />
                  <strong>{route.students}</strong> students
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="empty-state">
          <MapPin size={48} />
          <h3>No routes yet</h3>
          <p>Add a bus to create a new route.</p>
        </div>
      )}
    </div>
  );
};

export default ManageRoutes;
