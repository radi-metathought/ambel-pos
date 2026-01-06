import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * 
 * Protects routes from unauthorized access.
 * Redirects to login page if user is not authenticated.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = authService.isAdminAuthenticated();

  if (!isAuthenticated) {
    // Redirect to admin login page
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
