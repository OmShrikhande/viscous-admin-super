import React, { useState } from 'react';
import { 
  Bell, AlertTriangle, CheckCircle, Info, Fuel, 
  MapPin, Users, Trash2, CheckCheck
} from 'lucide-react';
import '../styles/Pages.css';

const initialNotifications = [
  { id: 1, type: 'warning', icon: Fuel, title: 'Bus B003 fuel critically low', desc: 'Fuel level at 15%. Immediate refueling is required before the next schedule.', time: '5 min ago', unread: true },
  { id: 2, type: 'success', icon: CheckCircle, title: 'Morning route R-101 completed', desc: 'All 42 students delivered to City University on time.', time: '32 min ago', unread: true },
  { id: 3, type: 'error', icon: AlertTriangle, title: 'Bus B003 scheduled maintenance', desc: 'Engine diagnostics required. Bus has been taken offline automatically.', time: '1 hr ago', unread: true },
  { id: 4, type: 'info', icon: MapPin, title: 'New route R-205 created', desc: 'Route from Green Park to Central University has been added to the system.', time: '2 hrs ago', unread: false },
  { id: 5, type: 'info', icon: Users, title: '3 new students registered', desc: 'Rahul, Priya, and Amit have been added to route R-101.', time: '3 hrs ago', unread: false },
  { id: 6, type: 'success', icon: CheckCircle, title: 'Driver verification complete', desc: 'John Doe has been verified and assigned to Bus B001.', time: '5 hrs ago', unread: false },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-page">
      <header className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated with fleet events, alerts, and system notifications.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn-secondary" onClick={markAllRead} id="btn-mark-all-read">
          <CheckCheck size={14} /> Mark All Read
        </button>
      </div>

      <div className="notif-list">
        {notifications.map(notif => (
          <div 
            className={`glass-card notif-card ${notif.unread ? 'unread' : ''}`} 
            key={notif.id}
            id={`notif-${notif.id}`}
          >
            <div className={`notif-icon ${notif.type}`}>
              <notif.icon size={20} />
            </div>
            <div className="notif-body">
              <div className="notif-title">{notif.title}</div>
              <div className="notif-desc">{notif.desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span className="notif-time">{notif.time}</span>
              <button 
                className="action-btn-sm danger" 
                title="Delete"
                style={{ width: 28, height: 28 }}
                onClick={() => deleteNotification(notif.id)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="empty-state">
            <Bell size={48} />
            <h3>All caught up!</h3>
            <p>No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
