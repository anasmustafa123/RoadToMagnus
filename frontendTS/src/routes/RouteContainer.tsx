import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProtectedRoute = () => {
  return (
    <div className="gridContainer">
      <Sidebar></Sidebar>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
