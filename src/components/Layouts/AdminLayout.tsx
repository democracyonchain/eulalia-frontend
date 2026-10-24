import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Inicio", path: "/admin", icon: "📋" },
    { name: "Solicitudes de organizaciones", path: "/admin/solicitudes", icon: "📄" },
    { name: "Billetera SSI de demostración", path: "/admin/wallet-demo", icon: "🔐" },
    { name: "Configuración", path: "/admin/configuracion", icon: "⚙️" },
    { name: "Gestión de Partidos", path: "/admin/partidos", icon: "🏛️" },
    { name: "Ciudadanos", path: "/admin/ciudadanos", icon: "🧑‍🤝‍🧑" },
    { name: "Reportes", path: "/admin/reportes", icon: "📊" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold mb-6">Digital Voter ID</div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
