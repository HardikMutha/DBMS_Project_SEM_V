import React from "react";
import { Navigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

// Protected Route Component - Only allows authenticated users
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { state } = useAuthContext();

  // Show loading state while checking authentication
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (adminOnly && state.user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
