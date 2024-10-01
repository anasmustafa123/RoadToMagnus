import { useContext, useRef, useEffect, Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Sidebar from '../components/MenuBar';
import styles from '../styles/ProtectedRoute.module.css';

const ProtectedRoute = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { menuBarTheme, showRigthSidebar, layout, setLayout } =
    useContext(UserContext);
  const { loader_data } = useLoaderData() as any;
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.className = `${styles.gridContainer} ${layout
        .map((v) => {
          return styles[v];
        })
        .join(' ')}`;
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
          className={`${styles.gridContainer} ${
            showRigthSidebar
              ? `${styles.layout_1} ${styles[menuBarTheme]}`
              : `${styles.layout_2} ${styles[menuBarTheme]}`
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
                /*  gridColumn:
                  menuBarTheme == 'v' || menuBarTheme == 'mv'
                    ? '2/3'
                    : menuBarTheme == 'h'
                      ? '1/2'
                      : 0,
                gridRow: menuBarTheme == 'h' ? '2/3' : '', */
              },
            }}
          />
        </div>
      </Await>
    </Suspense>
  );
};

export default ProtectedRoute;
