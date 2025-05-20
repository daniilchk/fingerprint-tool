import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './providers/auth-provider.jsx';
import LoginPage from './pages/login-page/index.jsx';
import Dashboard from './pages/dashboard-page/index.jsx';
import Layout from "./components/layout/index.jsx";
import Fingerprints from "./pages/fingerprints-page/index.jsx";
import DeviceMonitoring from "./pages/device-monitoring-page/index.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (user === null) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="fingerprints" element={<Fingerprints />} />
            <Route path="device-monitoring" element={<DeviceMonitoring />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
