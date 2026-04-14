import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('viscous_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('viscous_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('viscous_auth');
    }
  }, [user]);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Demo credentials
        if (
          (email === 'controller@viscous.in' && password === 'admin123') ||
          (email === 'admin@viscous.in' && password === 'admin123') ||
          (email.includes('@') && password.length >= 6)
        ) {
          const userData = {
            id: 'CT001',
            name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role: 'Controller',
            avatar: email.split('@')[0].slice(0, 2).toUpperCase(),
            college: 'City University',
            loginTime: new Date().toISOString(),
          };
          setUser(userData);
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1200);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viscous_auth');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
