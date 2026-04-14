import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Database } from 'lucide-react';
import '../styles/Pages.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    autoRefresh: true,
    locationTracking: true,
    darkMode: false,
    soundAlerts: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Configure your dashboard preferences and system settings.</p>
      </header>

      <div className="glass-card settings-section">
        <div className="settings-section-title">
          <Bell size={18} /> Notification Preferences
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Push Notifications</div>
            <div className="setting-desc">Receive push notifications for fleet events</div>
          </div>
          <button 
            className={`toggle ${settings.notifications ? 'on' : ''}`}
            onClick={() => toggle('notifications')}
            id="toggle-notifications"
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Email Alerts</div>
            <div className="setting-desc">Get daily summary reports via email</div>
          </div>
          <button 
            className={`toggle ${settings.emailAlerts ? 'on' : ''}`}
            onClick={() => toggle('emailAlerts')}
            id="toggle-email"
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Sound Alerts</div>
            <div className="setting-desc">Play sound when critical alerts arrive</div>
          </div>
          <button 
            className={`toggle ${settings.soundAlerts ? 'on' : ''}`}
            onClick={() => toggle('soundAlerts')}
            id="toggle-sound"
          />
        </div>
      </div>

      <div className="glass-card settings-section">
        <div className="settings-section-title">
          <Shield size={18} /> Fleet Monitoring
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Auto Refresh Data</div>
            <div className="setting-desc">Automatically refresh bus positions every 4 seconds</div>
          </div>
          <button 
            className={`toggle ${settings.autoRefresh ? 'on' : ''}`}
            onClick={() => toggle('autoRefresh')}
            id="toggle-autorefresh"
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">GPS Location Tracking</div>
            <div className="setting-desc">Enable real-time GPS tracking for all buses</div>
          </div>
          <button 
            className={`toggle ${settings.locationTracking ? 'on' : ''}`}
            onClick={() => toggle('locationTracking')}
            id="toggle-gps"
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Maintenance Reminders</div>
            <div className="setting-desc">Get alerts when buses are due for maintenance</div>
          </div>
          <button 
            className={`toggle ${settings.maintenanceAlerts ? 'on' : ''}`}
            onClick={() => toggle('maintenanceAlerts')}
            id="toggle-maintenance"
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Low Fuel Alerts</div>
            <div className="setting-desc">Alert when fuel drops below 20%</div>
          </div>
          <button 
            className={`toggle ${settings.fuelAlerts ? 'on' : ''}`}
            onClick={() => toggle('fuelAlerts')}
            id="toggle-fuel"
          />
        </div>
      </div>

      <div className="glass-card settings-section">
        <div className="settings-section-title">
          <Palette size={18} /> Appearance
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Dark Mode</div>
            <div className="setting-desc">Switch between light and dark themes</div>
          </div>
          <button 
            className={`toggle ${settings.darkMode ? 'on' : ''}`}
            onClick={() => toggle('darkMode')}
            id="toggle-darkmode"
          />
        </div>
      </div>

      <div className="glass-card settings-section">
        <div className="settings-section-title">
          <Database size={18} /> Data & Storage
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Clear Local Data</div>
            <div className="setting-desc">Remove all cached fleet data from this browser</div>
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => { localStorage.clear(); alert('Local data cleared!'); }}
            style={{ fontSize: '0.75rem' }}
            id="btn-clear-data"
          >
            Clear Data
          </button>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Export Fleet Data</div>
            <div className="setting-desc">Download all fleet data as JSON file</div>
          </div>
          <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '8px 16px' }} id="btn-export">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
