import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useFleet } from '../context/FleetContext';
import 'leaflet/dist/leaflet.css';
import '../styles/LiveMap.css';

// Fix for default Leaflet icon not showing up in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = new L.DivIcon({
  className: 'custom-bus-icon',
  html: `<div class="bus-marker-inner"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const LiveMap = () => {
  const { buses, busLocations } = useFleet();
  const nagpurCenter = [21.1458, 79.0882];

  return (
    <div className="glass-card map-wrapper" id="live-map-container">
      <div className="map-header">
        <div className="status-badge">
          <span className="pulse"></span>
          Live Fleet Tracking — Nagpur
        </div>
      </div>
      <MapContainer 
        center={nagpurCenter} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ 
          height: '400px', 
          width: '100%', 
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.12)'
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {buses.map(bus => {
          const loc = busLocations[bus.id];
          if (!loc) return null;
          
          return (
            <Marker 
              key={bus.id} 
              position={[loc.lat, loc.lng]} 
              icon={busIcon}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <div className="map-tooltip">
                  <strong>Bus {bus.id}</strong>
                  <span>{bus.routeNumber}</span>
                </div>
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <h3>Route {bus.routeNumber}</h3>
                  <p><strong>Driver:</strong> {bus.driverId}</p>
                  <p><strong>Status:</strong> {bus.status}</p>
                  <p><strong>From:</strong> {bus.from}</p>
                  <p><strong>To:</strong> {bus.to}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
