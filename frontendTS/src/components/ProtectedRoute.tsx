import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
  const { isUser } = useContext(UserContext);
  !isUser ? console.error('no no') : '';
  return isUser ? (
    <div className="gridContainer">
      <Sidebar></Sidebar>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;