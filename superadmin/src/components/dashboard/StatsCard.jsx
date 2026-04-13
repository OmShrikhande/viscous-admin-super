import './StatsCard.css';

const StatsCard = ({ title, value, change, changeType, icon, color }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return '#10b981';
    if (changeType === 'negative') return '#ef4444';
    return '#6b7280';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (changeType === 'negative') {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 7L17 17M17 17H7M17 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div className="stats-card" style={{ '--accent-color': color }}>
      <div className="stats-card-header">
        <div className="stats-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
        <div className="stats-change" style={{ color: getChangeColor() }}>
          {getChangeIcon()}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <div className="stats-card-body">
        <div className="stats-value">{value}</div>
        <div className="stats-title">{title}</div>
      </div>

      <div className="stats-card-footer">
        <div className="change-text" style={{ color: getChangeColor() }}>
          {changeType === 'positive' && '+'}
          {changeType === 'negative' && ''}
          {change}% from last month
        </div>
      </div>
    </div>
  );
};

export default StatsCard;