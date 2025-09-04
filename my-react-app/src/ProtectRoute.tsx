import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface Props {
  role: 'admin' | 'user';
}

export default function ProtectRoute({ role }: Props) {
  const { userRole } = useAuth();

  if (!userRole) return <Navigate to="/login" />;
  if (userRole !== role) return <Navigate to="/unauthorized" />;

  return <Outlet />;
}
