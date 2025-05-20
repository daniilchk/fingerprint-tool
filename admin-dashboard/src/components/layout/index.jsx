import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from "../navigation/index.jsx";
import { useAuth } from "../../providers/auth-provider.jsx";

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation onLogout={logout} />
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
