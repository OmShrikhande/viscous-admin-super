import { useState, useEffect } from 'react';
import './CollegeBranding.css';

const CollegeBranding = () => {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0
  });

  const targetStats = {
    students: 2847,
    faculty: 156,
    courses: 89
  };

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setStats({
          students: Math.floor(targetStats.students * progress),
          faculty: Math.floor(targetStats.faculty * progress),
          courses: Math.floor(targetStats.courses * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, increment);

      return () => clearInterval(timer);
    };

    // Start animation after component mounts
    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="college-branding">
      <div className="branding-content">
        <div className="shield-container">
          <svg className="college-shield" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f8ef7" />
                <stop offset="50%" stopColor="#764af1" />
                <stop offset="100%" stopColor="#f5c518" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Shield shape */}
            <path
              d="M100 20 L160 60 L180 120 L160 180 L100 220 L40 180 L20 120 L40 60 Z"
              fill="url(#shieldGradient)"
              stroke="#f5c518"
              strokeWidth="2"
              filter="url(#glow)"
              className="shield-path"
            />

            {/* Inner shield design */}
            <circle cx="100" cy="80" r="15" fill="#f5c518" opacity="0.8" />
            <rect x="85" y="100" width="30" height="20" rx="10" fill="#f5c518" opacity="0.6" />
            <circle cx="100" cy="140" r="8" fill="#f5c518" opacity="0.7" />

            {/* Decorative lines */}
            <line x1="70" y1="60" x2="130" y2="60" stroke="#f5c518" strokeWidth="1" opacity="0.5" />
            <line x1="60" y1="80" x2="140" y2="80" stroke="#f5c518" strokeWidth="1" opacity="0.5" />
            <line x1="70" y1="100" x2="130" y2="100" stroke="#f5c518" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        <h1 className="college-title">VISCOUS</h1>
        <p className="college-subtitle">College Administration</p>

        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{stats.students.toLocaleString()}</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.faculty}</div>
            <div className="stat-label">Faculty</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.courses}</div>
            <div className="stat-label">Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeBranding;