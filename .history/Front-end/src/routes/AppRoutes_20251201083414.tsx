import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/dashboard';
import React, { useEffect, useState } from 'react';
import { getToken, fetchCurrentUser, clearToken } from '../Services/Auth';
import LandingPage from '../pages/LandingPage/landingPage';
import Cadastro from '../pages/Cadastro/cadastro';
import Profile from '../pages/Profile/profile';
import HabitHistory from '../pages/HabitHistory/habithistory';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = getToken();
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
        if (user) {
          setAuthenticated(true);
        } else {
          // token invalid or expired
          clearToken();
          setAuthenticated(false);
        }
      } catch (err) {
        clearToken();
        setAuthenticated(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => { mounted = false; };
  }, [token]);

  if (checking) return null;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />  
        <Route path="/landingPage" element={<LandingPage />} />      
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}
