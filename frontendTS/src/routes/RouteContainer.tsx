import { Outlet } from 'react-router-dom';
import Sidebar from '../components/MenuBar';

const ProtectedRoute = () => {
  return (
    <div className="gridContainer">
      <Sidebar></Sidebar>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
