import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/dashboard';
import LandingPage from '../pages/LandingPage/landingPage';
import Cadastro from '../pages/Cadastro/cadastro';
import Profile from '../pages/Profile/profile';
import HabitHistory from '../pages/HabitHistory/habithistory';
import { fetchCurrentUser } from '../services/Auth';
import { useAuth } from '../auth/useAuth';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token, clearToken } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!token) {
      setAuthenticated(false);
      setChecking(false);
      return;
    }

    (async () => {
      try {
        const user = await fetchCurrentUser();
        if (!mounted) return;
        setAuthenticated(!!user);
        if (!user) clearToken();
      } catch {
        clearToken();
        setAuthenticated(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => { mounted = false; };
  }, [token, clearToken]);

  if (checking) return null;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />

        <Route path="/landingPage" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/cadastro" element={
          <PublicRoute>
            <Cadastro />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/meus-habitos" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/rotina" element={
          <PrivateRoute>
            <HabitHistory />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/habits/:id/history" element={
          <PrivateRoute>
            <HabitHistory />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
