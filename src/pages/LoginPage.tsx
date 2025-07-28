import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';


import API_BASE_URL from '../config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, { email, password });
      const token = response.data.token;
      const decoded: any = jwtDecode(token);
      login(token);
      setError('');
      if (decoded.rol === "1") navigate("/admin");
      else if (decoded.rol === "2") navigate("/organismo");
      else if (decoded.rol === "3") navigate("/partido");
      else if (decoded.rol === "4") navigate("/ciudadano");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña inválidos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>

      <h2 >Iniciar Sesión</h2>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

       <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
  <button
    onClick={handleLogin}
    className="btn-primary"
  >
    Iniciar sesión
  </button>

  <button
    onClick={() => navigate('/solicitud-organizacion')}
    className="btn-primary"
  >
    Solicitar Registro como Partido
  </button>
</div>

      </div>

    </div>
  );
}

export default LoginPage;
