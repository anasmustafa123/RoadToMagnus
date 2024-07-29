import React, { useContext, useRef, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from '../components/MenuBar';

const ProtectedRoute = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isUser, menuBarTheme } = useContext(UserContext);

  !isUser ? console.error('cant access route if not logged in') : '';

  useEffect(() => {
    sidebarRef.current
      ? (sidebarRef.current.className = `gridContainer ${
          menuBarTheme == 'v'
            ? ' verticalMenuBar'
            : menuBarTheme == 'h'
              ? ' horizontalMenubar'
              : menuBarTheme == 'mv'
                ? ' minimizedverticalMenuBar'
                : ''
        }`)
      : '';
  }, [menuBarTheme]);
  return isUser ? (
    <div
      ref={sidebarRef}
      className={`gridContainer ${
        menuBarTheme == 'v'
          ? ' verticalMenuBar'
          : menuBarTheme == 'h'
            ? ' horizontalMenubar'
            : menuBarTheme == 'mv'
              ? ' minimizedverticalMenuBar'
              : ''
      }`}
    >
      <Sidebar
        inlineStyles={{
          gridColumn:
            menuBarTheme == 'v' || menuBarTheme == 'mv'
              ? '1/2'
              : menuBarTheme == 'h'
                ? '1/3'
                : 0,
        }}
      />
      <Outlet
        context={{
          gridColumn:
            menuBarTheme == 'v' || menuBarTheme == 'mv'
              ? '2/3'
              : menuBarTheme == 'h'
                ? '1/2'
                : 0,
        }}
      />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
