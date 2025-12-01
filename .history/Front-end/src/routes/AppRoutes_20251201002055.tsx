import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/dashboard';
import { getToken } from '../Services/Auth';
import React from 'react';
import LandingPage from '../pages/LandingPage/landingPage';
import Cadastro from '../pages/Cadastro/cadastro';
import Profile from '../pages/Profile/profile';
import HabitHistory from '../pages/HabitHistory/habithistory';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landingPage" replace />} />  
        <Route path="/landingPage" element={<LandingPage />} />      
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
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
