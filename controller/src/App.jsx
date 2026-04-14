import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FleetProvider } from './context/FleetContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BusDetail from './pages/BusDetail';
import AddBus from './pages/AddBus';
import AddDriver from './pages/AddDriver';
import Analytics from './pages/Analytics';
import LiveStream from './pages/LiveStream';
import UsersPage from './pages/UsersPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ManageRoutes from './pages/ManageRoutes';
import PlanExpiredPage from './pages/PlanExpiredPage';
import './styles/global.css';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div className="login-spinner" style={{
          width: 32,
          height: 32,
          border: '3px solid var(--bg-tertiary)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to plan expired page if plan is over
  if (user?.planExpired && window.location.pathname !== '/plan-expired') {
    return <Navigate to="/plan-expired" replace />;
  }

  return children;
};

// Public route — redirect if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Permission route wrapper
const PermissionRoute = ({ permission, children }) => {
  const { user } = useAuth();
  const hasPermission = user?.role === 'super_admin' || user?.permissions?.includes(permission);

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <FleetProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bus/:id" element={<BusDetail />} />
                  <Route path="/add-bus" element={
                    <PermissionRoute permission="manage_buses">
                      <AddBus />
                    </PermissionRoute>
                  } />
                  <Route path="/add-driver" element={
                    <PermissionRoute permission="manage_drivers">
                      <AddDriver />
                    </PermissionRoute>
                  } />
                  <Route path="/analytics" element={
                    <PermissionRoute permission="view_analytics">
                      <Analytics />
                    </PermissionRoute>
                  } />
                  <Route path="/live-stream" element={
                    <PermissionRoute permission="view_livestream">
                      <LiveStream />
                    </PermissionRoute>
                  } />
                  <Route path="/users" element={
                    <PermissionRoute permission="manage_users">
                      <UsersPage />
                    </PermissionRoute>
                  } />
                  <Route path="/notifications" element={
                    <PermissionRoute permission="manage_notifications">
                      <NotificationsPage />
                    </PermissionRoute>
                  } />
                  <Route path="/settings" element={
                    <PermissionRoute permission="manage_settings">
                      <SettingsPage />
                    </PermissionRoute>
                  } />
                  <Route path="/manage-routes" element={
                    <PermissionRoute permission="manage_routes">
                      <ManageRoutes />
                    </PermissionRoute>
                  } />
                  <Route path="/plan-expired" element={<PlanExpiredPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </FleetProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
