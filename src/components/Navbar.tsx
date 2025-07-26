import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <div>
        <strong>Eulalia</strong>
      </div>
      <div>
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
