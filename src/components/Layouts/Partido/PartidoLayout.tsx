import { Outlet } from "react-router-dom";
import MenuPartidoLayout from "./MenuPartidoLayout";

const PartidoLayout = () => {
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Menú lateral fijo de 240px (w-60) */}
      <div className="fixed top-0 left-0 h-screen w-60 z-20">
        <MenuPartidoLayout />
      </div>

      {/* Contenedor principal: desplazado a la derecha y ajustado al ancho restante */}
   <div className="m-60 flex flex-col min-h-screen w-[calc(100%-240px)]" style={{ marginLeft: '240px' }}  >      
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 text-2xl font-bold text-gray-800" style={{ backgroundColor: '#f9fafb', padding: '1rem 1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}  >
          
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Aquí se renderizará el contenido de las rutas hijas */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PartidoLayout;
