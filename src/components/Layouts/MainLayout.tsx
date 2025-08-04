import React from 'react';
import { Outlet } from 'react-router-dom';
// import Sidebar from '../Sidebar'; // Eventualmente, aquí importarías tu componente de barra lateral

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <aside>
        {/* Aquí iría tu componente de barra lateral (Sidebar) */}
        {/* Mientras tanto, puedes usar un placeholder: */}
        <div className="h-full bg-gray-100 p-4 shadow-md">
          
        </div>
      </aside>
      <main>
        <Outlet /> {/* Aquí se renderizarán las páginas anidadas */}
      </main>
    </div>
  );
};

export default MainLayout;
