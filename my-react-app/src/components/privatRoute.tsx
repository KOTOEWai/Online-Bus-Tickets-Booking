import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import type { JSX } from 'react';

interface Props {
  allowedRoles: string[];
  children: JSX.Element;
}

export default function PrivateRoute({ allowedRoles, children }: Props) {
  const role = getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
