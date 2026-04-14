import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map center and zoom based on path bounds
const MapAutoFit = ({ path }) => {
  const map = useMap();
  
  useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);

  return null;
};

const HistoryMap = ({ path }) => {
  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (!path || path.length === 0) {
    return (
      <div className="empty-map-placeholder">
        <p>No trip data available for this date</p>
      </div>
    );
  }

  return (
    <div className="history-map-container" style={{ 
      height: '400px', 
      width: '100%', 
      borderRadius: '14px', 
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(99, 102, 241, 0.08)',
      border: '1px solid rgba(99, 102, 241, 0.12)'
    }}>
      <MapContainer 
        center={path[0]} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* The traveled path line */}
        <Polyline 
          positions={path} 
          pathOptions={{ 
            color: '#6366f1', 
            weight: 5, 
            opacity: 0.4,
            dashArray: '1, 10',
            lineJoin: 'round'
          }} 
        />
        
        {/* Vibrant solid line on top */}
        <Polyline 
          positions={path} 
          pathOptions={{ 
            color: '#6366f1', 
            weight: 3, 
            opacity: 1,
            lineJoin: 'round'
          }} 
        />

        {/* Start Point */}
        <Marker position={path[0]} icon={startIcon}>
          <Popup>Trip Start</Popup>
        </Marker>

        {/* End Point */}
        <Marker position={path[path.length - 1]} icon={endIcon}>
          <Popup>Last Recorded Location</Popup>
        </Marker>

        <MapAutoFit path={path} />
      </MapContainer>
    </div>
  );
};

export default HistoryMap;
