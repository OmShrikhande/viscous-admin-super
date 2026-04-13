import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/feedback/ProtectedRoute';
import ErrorBoundary from './components/feedback/ErrorBoundary';
import LoadingSpinner from './components/feedback/LoadingSpinner';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('./pages/login/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const CollegesPage = lazy(() => import('./pages/colleges/CollegesPage'));
const CollegeDetailPage = lazy(() => import('./pages/colleges/CollegeDetailPage'));
const ControllersPage = lazy(() => import('./pages/controllers/ControllersPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const BillingPage = lazy(() => import('./pages/billing/BillingPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const LogsPage = lazy(() => import('./pages/logs/LogsPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullPage message="Loading module..." />}>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes with layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="colleges" element={<CollegesPage />} />
              <Route path="colleges/:id" element={<CollegeDetailPage />} />
              <Route path="controllers" element={<ControllersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="logs" element={<LogsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
