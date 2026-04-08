import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Compass } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-10 h-10 text-brand-blue animate-spin mx-auto" style={{ animationDuration: '3s' }} />
          <p className="text-sm text-slate-400 mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the correct portal
    return <Navigate to={user.role === 'employer' ? '/employer' : '/employee'} replace />;
  }

  return children;
}
