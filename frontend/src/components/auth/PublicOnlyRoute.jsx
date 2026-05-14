import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getRoleHome } from '../../utils/auth.js';

export default function PublicOnlyRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-leaf-700">
        <Spinner label="Loading" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
}
