import  { useContext, useRef, useEffect, Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from '../components/MenuBar';

const ProtectedRoute = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { menuBarTheme, showRigthSidebar } = useContext(UserContext);
  const { loader_data } = useLoaderData() as any;
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
  return (
    <Suspense
      fallback={
        <>
          <img
            style={{
              width: '100vw',
              position: 'absolute',
            }}
            src="/background/loadingPage.png"
          />
        </>
      }
    >
      <Await resolve={loader_data}  errorElement={<Navigate to="/login" />}>
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
      </Await>
    </Suspense>
  );
};

export default ProtectedRoute;
