import { useState } from 'react';
import './TopBar.css';

const TopBar = ({ onMenuClick }) => {
  const [notifications] = useState([
    { id: 1, message: 'New student registration', time: '2 min ago', unread: true },
    { id: 2, message: 'Course enrollment deadline', time: '1 hour ago', unread: true },
    { id: 3, message: 'System maintenance scheduled', time: '3 hours ago', unread: false }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Overview</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input type="text" placeholder="Search..." />
        </div>

        <div className="topbar-actions">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="profile-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showProfile && (
              <div className="profile-menu">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">System Admin</div>
                    <div className="profile-email">admin@bustracker.pro</div>
                  </div>
                </div>
                <div className="profile-menu-items">
                  <button className="menu-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Profile
                  </button>
                  <button className="menu-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M19.4 15C19.4 15 20.5 13.5 20.5 12C20.5 10.5 19.4 9 19.4 9M4.6 9C4.6 9 3.5 10.5 3.5 12C3.5 13.5 4.6 15 4.6 15M16.5 7.5C16.5 7.5 17 6.5 17 6C17 5.5 16.5 4.5 16.5 4.5M7.5 19.5C7.5 19.5 7 20.5 7 21C7 21.5 7.5 22.5 7.5 22.5M16.5 16.5C16.5 16.5 17 17.5 17 18C17 18.5 16.5 19.5 16.5 19.5M7.5 4.5C7.5 4.5 7 3.5 7 3C7 2.5 7.5 1.5 7.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Settings
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showNotifications && (
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <span className="notification-count">{unreadCount} new</span>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {notification.unread && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
            <div className="notifications-footer">
              <button className="view-all-btn">View All Notifications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;