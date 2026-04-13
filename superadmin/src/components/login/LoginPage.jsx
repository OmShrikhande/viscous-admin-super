import { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import CollegeBranding from './CollegeBranding';
import LoginForm from './LoginForm';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page">
      <ParticleBackground />

      <div className="login-container">
        <div className="login-left">
          <CollegeBranding />
        </div>

        <div className="login-right">
          <LoginForm onLogin={onLogin} />
        </div>
      </div>

      {/* Floating geometric shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
    </div>
  );
};

export default LoginPage;