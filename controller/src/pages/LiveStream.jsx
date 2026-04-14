import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Maximize2, X, Volume2, Settings, 
  Bus, Eye, RefreshCw
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import '../styles/LiveStream.css';

const LiveStream = () => {
  const { buses } = useFleet();
  const [fullscreenBus, setFullscreenBus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="livestream-page">
      <header className="page-header">
        <h1>Live CCTV Stream</h1>
        <p>Real-time camera feeds from all buses in your fleet.</p>
      </header>

      {/* Stream Grid */}
      <div className="stream-grid" id="stream-grid">
        {buses.map((bus) => (
          <div 
            className={`stream-card ${bus.online ? 'active' : ''}`} 
            key={bus.id}
            id={`stream-${bus.id}`}
          >
            <div className={`stream-video ${bus.online ? 'live' : ''}`}>
              {bus.online ? (
                <>
                  <div className="live-badge">
                    <span className="live-dot"></span>
                    LIVE
                  </div>
                  <div className="time-badge">{formatTime(currentTime)}</div>
                  <div className="camera-sim">
                    <div className="cam-grid">
                      <div className="cam-cell"></div>
                      <div className="cam-cell"></div>
                      <div className="cam-cell"></div>
                      <div className="cam-cell"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="offline-overlay">
                  <VideoOff size={40} />
                  <span>Camera Offline</span>
                </div>
              )}
            </div>
            <div className="stream-info">
              <div className="stream-details">
                <span className="stream-bus-name">
                  <Bus size={16} />
                  Bus {bus.id} — {bus.routeNumber}
                </span>
                <span className="stream-route-info">
                  {bus.from} → {bus.to} • {bus.status}
                </span>
              </div>
              <div className="stream-actions">
                {bus.online && (
                  <>
                    <button 
                      className="stream-action-btn" 
                      title="Fullscreen"
                      onClick={() => setFullscreenBus(bus)}
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button className="stream-action-btn" title="Audio">
                      <Volume2 size={16} />
                    </button>
                  </>
                )}
                <button className="stream-action-btn" title="Refresh">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {fullscreenBus && (
        <div className="fullscreen-viewer" id="fullscreen-viewer">
          <button 
            className="fullscreen-close" 
            onClick={() => setFullscreenBus(null)}
            id="btn-close-fullscreen"
          >
            <X size={24} />
          </button>
          <div className="fullscreen-video">
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </div>
            <div className="time-badge">{formatTime(currentTime)}</div>
            <div className="camera-sim">
              <div className="cam-grid">
                <div className="cam-cell"></div>
                <div className="cam-cell"></div>
                <div className="cam-cell"></div>
                <div className="cam-cell"></div>
              </div>
            </div>
          </div>
          <div className="fullscreen-info">
            <h3>Bus {fullscreenBus.id} — {fullscreenBus.routeNumber}</h3>
            <p>{fullscreenBus.from} → {fullscreenBus.to}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStream;
