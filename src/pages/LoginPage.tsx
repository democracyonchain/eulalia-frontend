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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="inst-card w-full max-w-md p-8 bg-white border-t-8 border-t-slate-900">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Iniciar Sesión</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button
              onClick={handleLogin}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-slate-900/10"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => navigate('/solicitud-organizacion')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg border border-slate-300 transition-colors"
            >
              Solicitar Registro como Partido
            </button>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">Plataforma Eulalia • Fase 2</p>
      </div>
    </div>
  );
}

export default LoginPage;
