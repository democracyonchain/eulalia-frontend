import { createContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  rol: string | null;
  organizacionId: number | null;
  cedula: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  rol: null,
  organizacionId: null,
  cedula: null,
  login: () => { },
  logout: () => { },
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizacionId, setOrganizacionId] = useState<number | null>(null);
  const [cedula, setCedula] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        jwtDecode(storedToken);
        const decoded: any = jwtDecode(storedToken);
        setToken(storedToken);
        setRol(decoded.rol);
        setOrganizacionId(decoded.organizacion_id ?? null);
        setCedula(decoded.cedula ?? null);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, rol, organizacionId, cedula, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
