import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import MainLayout from "./components/Layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import OrganismoHomePage from './pages/organismo/HomePage';
import CiudadanoHomePage from './pages/ciudadano/HomePage';
import PartidoHomePage from './pages/partido/HomePage';
import AdminHomePage from './pages/admin/HomePage';
import SolicitudOrganizacionPage from './pages/public/SolicitudOrganizacionPage';
import SolicitudesPage from "./pages/organismo/solicitudes/SolicitudesPage";
import UsuariosPage from "./pages/organismo/usuarios/UsuariosPage";
import ReportesPage from "./pages/organismo/reportes/ReportesPage";
import OrganismoLayout from "./components/Layouts/Organismo/OrganismoLayout";
import CrearAnalistaPage from "./pages/organismo/usuarios/CrearAnalistaPage";
import PartidoLayout from "./components/Layouts/Partido/PartidoLayout";
import InformacionPage from "./components/Layouts/Partido/InformacionPage";
import AfiliadosPage from "./components/Layouts/Partido/AfiliadosPage";
import DirectivaPage from "./components/Layouts/Partido/DirectivaPage";
import DocumentosPage from "./components/Layouts/Partido/DocumentosPage";
import ReportePartidoPage from "./components/Layouts/Partido/ReportesPage";

function App() {
  const { isAuthenticated, token, isLoading } = useContext(AuthContext);

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
      <div className="h-full">
        <Routes>
          {/* Rutas públicas que no usan el layout principal */}
          <Route path="/" element={isAuthenticated ? <Navigate to={rutaPorRol} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/solicitud-organizacion" element={<SolicitudOrganizacionPage />} />

          {/* Agrupamos las rutas protegidas que compartirán el layout */}
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/ciudadano" element={<CiudadanoHomePage />} />
          </Route>
          {/* Sección Partido - Layout separado */}
          <Route path="/partido" element={<PartidoLayout />}>
            <Route index element={<PartidoHomePage />} />
            <Route path="informacion" element={<InformacionPage />} />
            <Route path="afiliados" element={<AfiliadosPage />} />
            <Route path="directiva" element={<DirectivaPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="reportes" element={<ReportePartidoPage />} />
          </Route>
          {/* Sección Organismo - Layout separado */}
          <Route path="/organismo" element={<OrganismoLayout />}>
            <Route index element={<OrganismoHomePage />} />
            <Route path="solicitudes" element={<SolicitudesPage />} />
            <Route path="usuarios">
              <Route index element={<UsuariosPage />} />
              <Route path="crear" element={<CrearAnalistaPage />} />
            </Route>
            <Route path="reportes" element={<ReportesPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;