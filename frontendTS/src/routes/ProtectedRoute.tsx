import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = (params: { Component: JSX.Element }) => {
  const { isUser } = useContext(UserContext);
  isUser ? console.error('no no') : '';
  return isUser ? <>{params.Component}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
