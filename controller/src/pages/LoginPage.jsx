import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Bus, AlertCircle,
  MapPin, BarChart3, Video, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('controller@viscous.in');
    setPassword('admin123');
  };

  return (
    <div className="login-page">
      {/* Left Hero Panel */}
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <Bus size={26} />
            </div>
            <span className="hero-logo-text">Viscous</span>
          </div>

          <h2 className="hero-tagline">
            Smart Fleet<br />
            Management for<br />
            Modern Institutions
          </h2>

          <p className="hero-desc">
            Track your entire bus fleet in real-time, manage drivers, 
            monitor student safety, and gain powerful analytics — 
            all from one unified dashboard.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <MapPin size={18} />
              </div>
              <span>Real-time GPS fleet tracking</span>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <Video size={18} />
              </div>
              <span>Live CCTV bus camera streams</span>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <BarChart3 size={18} />
              </div>
              <span>Advanced analytics & reporting</span>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-icon">
                <Shield size={18} />
              </div>
              <span>Comprehensive student safety tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-header">
          <h1>Welcome back 👋</h1>
          <p>Sign in to your controller dashboard to manage your fleet.</p>
        </div>

        {error && (
          <div className="login-error" id="login-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} id="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                id="input-email"
              />
              <Mail size={18} />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                id="input-password"
              />
              <Lock size={18} />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                id="btn-toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
            id="btn-login"
          >
            {loading ? (
              <div className="login-spinner"></div>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>Demo Access</span>
        </div>

        <div className="demo-credentials">
          <p>Use demo credentials to explore the dashboard</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <code>controller@viscous.in</code>
            <code>admin123</code>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            style={{
              marginTop: 12,
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: 8,
              padding: '6px 16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontFamily: 'inherit'
            }}
            id="btn-fill-demo"
          >
            Fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
