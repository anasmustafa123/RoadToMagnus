import { useContext, useRef, useEffect, Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from '../components/MenuBar';

const ProtectedRoute = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { menuBarTheme, showRigthSidebar, layout, setLayout } =
    useContext(UserContext);
  const { loader_data } = useLoaderData() as any;
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.className = `gridContainer ${layout.join(' ')}`;
    }
  }, [layout]);

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
      <Await resolve={loader_data} errorElement={<Navigate to="/login" />}>
        <div
          ref={sidebarRef}
          className={`gridContainer ${
            menuBarTheme == 'v'
              ? showRigthSidebar
                ? 'layout_1 v'
                : 'layout_2 v'
              : menuBarTheme == 'h'
                ? showRigthSidebar
                  ? 'layout_1 h'
                  : 'layout_2 h'
                : menuBarTheme == 'mv'
                  ? showRigthSidebar
                    ? 'layout_1 mv'
                    : 'layout_2 mv'
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
