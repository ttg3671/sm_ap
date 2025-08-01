import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  
  if (!token) {
    return React.createElement(Navigate, { to: "/", replace: true });
  }
  
  return children;
};

export default ProtectedRoute;
