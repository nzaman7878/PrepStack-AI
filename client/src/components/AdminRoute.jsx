import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import AuthContext from '../contexts/AuthContext';

export default function AdminRoute() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not logged in, they will be caught by ProtectedRoute first, but just in case:
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
