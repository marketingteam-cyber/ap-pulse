import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeePortal from './pages/EmployeePortal';
import EmployerPortal from './pages/EmployerPortal';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'employer' ? '/employer' : '/employee'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Employee portal */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeePortal />
            </ProtectedRoute>
          }
        />

        {/* Employer portal */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerPortal />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
