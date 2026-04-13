import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import StatsCard from './StatsCard';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsData = [
    {
      title: 'Active Buses',
      value: '247',
      change: 8,
      changeType: 'positive',
      color: '#4f8ef7',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5C3.89543 17 3 16.1046 3 15V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V15C21 16.1046 20.1046 17 19 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="16.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9H21M7 13H9M15 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Online Systems',
      value: '189',
      change: 12,
      changeType: 'positive',
      color: '#10b981',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'School Admins',
      value: '34',
      change: 3,
      changeType: 'positive',
      color: '#f59e0b',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Monthly Revenue',
      value: '$47.2K',
      change: -5,
      changeType: 'negative',
      color: '#8b5cf6',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1>Bus Tracker Dashboard</h1>
              <p>Monitor your school bus fleet, system status, and admin management in real-time.</p>
            </div>

            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>System Activity</h3>
                  <button className="view-all-btn">View All</button>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p>Bus <strong>BT-247</strong> system came online - Route 5</p>
                      <span className="activity-time">5 min ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p>Admin <strong>Sarah Johnson</strong> reported GPS issue on Bus BT-156</p>
                      <span className="activity-time">12 min ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p>Bus <strong>BT-089</strong> went offline - Engine failure detected</p>
                      <span className="activity-time">18 min ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon" style={{ background: 'rgba(79, 142, 247, 0.2)', color: '#4f8ef7' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="activity-content">
                      <p>New admin <strong>Mike Chen</strong> added to Lincoln High School</p>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 17H5C3.89543 17 3 16.1046 3 15V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V15C21 16.1046 20.1046 17 19 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="16.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 9H21M7 13H9M15 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add New Bus
                  </button>
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add School Admin
                  </button>
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polygon points="10,8 16,12 10,16 10,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Live Tracking
                  </button>
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    System Reports
                  </button>
                </div>
              </div>
            </div>

            {/* System Status Monitoring */}
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Bus System Status</h3>
                  <div className="status-indicators">
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <span>Online: 189</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot offline"></div>
                      <span>Offline: 58</span>
                    </div>
                  </div>
                </div>
                <div className="bus-status-grid">
                  {[
                    { id: 'BT-001', status: 'online', school: 'Lincoln High', route: 'Route A', lastSeen: '2 min ago' },
                    { id: 'BT-002', status: 'online', school: 'Washington Elementary', route: 'Route B', lastSeen: '1 min ago' },
                    { id: 'BT-003', status: 'offline', school: 'Jefferson Middle', route: 'Route C', lastSeen: '45 min ago' },
                    { id: 'BT-004', status: 'online', school: 'Roosevelt High', route: 'Route D', lastSeen: '3 min ago' },
                    { id: 'BT-005', status: 'maintenance', school: 'Adams Elementary', route: 'Route E', lastSeen: '2 hours ago' },
                    { id: 'BT-006', status: 'online', school: 'Madison Middle', route: 'Route F', lastSeen: '1 min ago' },
                  ].map((bus) => (
                    <div key={bus.id} className={`bus-status-item ${bus.status}`}>
                      <div className="bus-info">
                        <div className="bus-id">{bus.id}</div>
                        <div className="bus-school">{bus.school}</div>
                        <div className="bus-route">{bus.route}</div>
                      </div>
                      <div className="bus-status">
                        <div className={`status-indicator ${bus.status}`}>
                          <div className="status-dot"></div>
                          <span className="status-text">
                            {bus.status === 'online' ? 'Online' :
                             bus.status === 'offline' ? 'Offline' : 'Maintenance'}
                          </span>
                        </div>
                        <div className="last-seen">{bus.lastSeen}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Admin Payment Status</h3>
                  <button className="view-all-btn">View All</button>
                </div>
                <div className="payment-status-list">
                  {[
                    { school: 'Lincoln High School', admin: 'Sarah Johnson', status: 'paid', amount: '$450', dueDate: 'Paid' },
                    { school: 'Washington Elementary', admin: 'Mike Chen', status: 'pending', amount: '$380', dueDate: 'Due in 5 days' },
                    { school: 'Jefferson Middle School', admin: 'Emily Davis', status: 'overdue', amount: '$420', dueDate: 'Overdue 3 days' },
                    { school: 'Roosevelt High School', admin: 'David Wilson', status: 'paid', amount: '$510', dueDate: 'Paid' },
                    { school: 'Adams Elementary', admin: 'Lisa Brown', status: 'pending', amount: '$350', dueDate: 'Due in 12 days' },
                  ].map((payment, index) => (
                    <div key={index} className={`payment-item ${payment.status}`}>
                      <div className="payment-info">
                        <div className="school-name">{payment.school}</div>
                        <div className="admin-name">{payment.admin}</div>
                      </div>
                      <div className="payment-details">
                        <div className="amount">{payment.amount}</div>
                        <div className={`payment-status ${payment.status}`}>
                          {payment.status === 'paid' ? '✓ Paid' :
                           payment.status === 'pending' ? '⏳ Pending' : '⚠️ Overdue'}
                        </div>
                        <div className="due-date">{payment.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="dashboard-content">
            <div className="coming-soon">
              <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section</h2>
              <p>This section is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;