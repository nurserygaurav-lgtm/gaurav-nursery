import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-leaf-700">
        <Spinner label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
