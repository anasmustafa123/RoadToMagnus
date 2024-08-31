import React, { useContext, useRef, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from '../components/MenuBar';

const ProtectedRoute = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isUser, menuBarTheme, showRigthSidebar } = useContext(UserContext);

  !isUser ? console.warn('cant access route if not logged in') : '';

  useEffect(() => {
    sidebarRef.current
      ? (sidebarRef.current.className = `gridContainer ${
          menuBarTheme == 'v'
            ? showRigthSidebar
              ? 'layout_1_v'
              : 'layout_2_v'
            : menuBarTheme == 'h'
              ? showRigthSidebar
                ? 'layout_1_h'
                : 'layout_2_h'
              : menuBarTheme == 'mv'
                ? showRigthSidebar
                  ? 'layout_1_mv'
                  : 'layout_2_mv'
                : ''
        }`)
      : '';
  }, [menuBarTheme]);
  console.log({showRigthSidebar})
  return isUser ? (
    <div
      ref={sidebarRef}
      className={`gridContainer ${
        menuBarTheme == 'v'
          ? showRigthSidebar
            ? 'layout_1_v'
            : 'layout_2_v'
          : menuBarTheme == 'h'
            ? showRigthSidebar
              ? 'layout_1_h'
              : 'layout_2_h'
            : menuBarTheme == 'mv'
              ? showRigthSidebar
                ? 'layout_1_mv'
                : 'layout_2_mv'
              : ''
      }`}
    >
      <Sidebar
        classNames={
          menuBarTheme == 'v'
            ? ['sidebar']
            : menuBarTheme == 'mv'
              ? ['sidebar', 'min']
              : menuBarTheme == 'h'
                ? ['header']
                : ['']
        }
      />
      <Outlet
        context={{
          outletStyles: {
            gridColumn:
              menuBarTheme == 'v' || menuBarTheme == 'mv'
                ? '2/3'
                : menuBarTheme == 'h'
                  ? '1/2'
                  : 0,
            gridRow: menuBarTheme == 'h' ? '2/3' : '',
          },
        }}
      />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
