import React from 'react';
import { 
  ShieldAlert, Mail, Phone, ExternalLink, 
  ArrowLeft, CreditCard, Clock, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css'; // Reuse some grid styles

const PlanExpiredPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="plan-expired-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '48px',
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: 'var(--error)'
        }}>
          <ShieldAlert size={42} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-secondary)',
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          letterSpacing: '-0.02em'
        }}>
          Access Restricted
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}>
          The subscription plan for <strong>{user?.college || 'your institution'}</strong> has expired. 
          To restore access to your fleet management tools, please contact your Super Admin.
        </p>

        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--accent)' }}><Clock size={16} /></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Expired on: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Recently</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--accent)' }}><Lock size={16} /></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Status: <span style={{ fontWeight: 600, color: 'var(--error)' }}>Account Locked</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <button 
            onClick={() => window.location.href = `mailto:admin@viscous.in?subject=Plan Restoration: ${user?.college}`}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--accent-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Mail size={18} />
            Contact Super Admin
          </button>

          <button 
            onClick={logout}
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              color: 'var(--text-secondary)',
              border: '1.5px solid var(--card-border)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        </div>

        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Phone size={14} /> +91-XXXXXXXXXX
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ExternalLink size={14} /> viscous.in
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiredPage;
