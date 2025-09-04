/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    setUserRole(role);
  }, []);

  const login = (role: string) => {
    sessionStorage.setItem('role', role);
    setUserRole(role);
  };

  const logout = () => {
    sessionStorage.clear();
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
