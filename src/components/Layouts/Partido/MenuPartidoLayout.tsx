import { NavLink } from "react-router-dom";
import { Users, FileText, FolderOpen, BarChart2, Info } from "lucide-react";

const MenuPartidoLayout = () => {
  return (
    <div className="flex flex-col h-screen" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header
        className="bg-white px-6 py-4 shadow-sm border-b border-slate-200 text-base font-bold text-slate-800"
        style={{
          zIndex: 10
        }}
      >
        Eulalia VoterID - Gestión Partidista
      </header>

      <div className="flex flex-1" style={{ display: 'flex', flex: '1' }}>
        {/* Menú lateral */}
        <aside
          className="w-60 bg-blue-900 text-white p-6 space-y-6"
          style={{
            width: '15rem',
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Partido
          </h2>
          <nav className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <NavLink
              to="/partido/informacion"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-800 transition ${isActive ? "bg-blue-800 font-bold" : ""
                }`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Info size={20} />
              <span>Información</span>
            </NavLink>

            <NavLink
              to="/partido/afiliados"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-800 transition ${isActive ? "bg-blue-800 font-bold" : ""
                }`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Users size={20} />
              <span>Afiliados</span>
            </NavLink>

            <NavLink
              to="/partido/directiva"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-800 transition ${isActive ? "bg-blue-800 font-bold" : ""
                }`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <FileText size={20} />
              <span>Directiva</span>
            </NavLink>

            <NavLink
              to="/partido/documentos"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-800 transition ${isActive ? "bg-blue-800 font-bold" : ""
                }`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <FolderOpen size={20} />
              <span>Documentos</span>
            </NavLink>

            <NavLink
              to="/partido/reportes"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-800 transition ${isActive ? "bg-blue-800 font-bold" : ""
                }`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <BarChart2 size={20} />
              <span>Reportes</span>
            </NavLink>
          </nav>
        </aside>

        {/* Contenido de la sección */}
        <main
          className="flex-1 overflow-auto p-6 bg-gray-50"
          style={{
            flex: '1',
            overflow: 'auto',
            padding: '1.5rem',
            backgroundColor: '#f9fafb'
          }}
        >

        </main>
      </div>
    </div>
  );
};

export default MenuPartidoLayout;
