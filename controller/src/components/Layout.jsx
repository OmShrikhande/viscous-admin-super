import React from 'react';
import { Search, Bell, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="top-bar" id="top-bar">
          <div className="top-bar-left">
            <div className="top-bar-search">
              <Search size={16} />
              <input type="text" placeholder="Search buses, routes, drivers..." id="search-input" />
            </div>
          </div>
          <div className="top-bar-right">
            <div className="top-bar-date">
              <CalendarDays size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              {today}
            </div>
            <button className="top-bar-icon" id="btn-notifications" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
