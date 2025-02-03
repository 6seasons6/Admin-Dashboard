// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { authData } = useAuth();  // Use useAuth to access authData

  // If user is not logged in (no user data), redirect to login
  if (!authData.user) {
    return <Navigate to="/login" />;
  }

  return children;  // Render children if user is logged in
};

export default ProtectedRoute;
