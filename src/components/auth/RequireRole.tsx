import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";

const roleLandingPath = (role: string | null) => {
  switch (role) {
    case "1":
      return "/admin";
    case "2":
    case "3":
      return "/partido";
    case "4":
      return "/ciudadano";
    case "5":
      return "/organismo";
    default:
      return "/login";
  }
};

type RequireRoleProps = {
  children: ReactNode;
  role: string;
};

export default function RequireRole({ children, role }: RequireRoleProps) {
  const { isAuthenticated, isLoading, rol } = useContext(AuthContext);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (rol !== role) return <Navigate to={roleLandingPath(rol)} replace />;

  return <>{children}</>;
}
