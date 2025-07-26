import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

import OrganismoHomePage from './pages/organismo/HomePage';
import PartidoHomePage from './pages/partido/HomePage';
import CiudadanoHomePage from './pages/ciudadano/HomePage';
import AdminHomePage from './pages/admin/HomePage';
import SolicitudOrganizacionPage from './pages/public/SolicitudOrganizacionPage'


import { jwtDecode } from "jwt-decode";

function App() {
  const { isAuthenticated, token, isLoading } = useContext(AuthContext);

  // Calcula ruta según el rol
  let rutaPorRol = "/login";
  if (isAuthenticated && token) {
    try {
      const decoded: any = jwtDecode(token);
      switch (decoded.rol) {
        case "1":
          rutaPorRol = "/admin";
          break;
        case "2":
          rutaPorRol = "/organismo";
          break;
        case "3":
          rutaPorRol = "/partido";
          break;
        case "4":
          rutaPorRol = "/ciudadano";
          break;
      }
    } catch (err) {
      console.error("Error decodificando el token", err);
    }
  }

  if (isLoading) return null;

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={rutaPorRol} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/organismo" element={<OrganismoHomePage />} />
          <Route path="/partido" element={<PartidoHomePage />} />
          <Route path="/ciudadano" element={<CiudadanoHomePage />} />
          <Route path="/solicitud-organizacion" element={<SolicitudOrganizacionPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
