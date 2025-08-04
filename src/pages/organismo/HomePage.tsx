import { useNavigate } from "react-router-dom";
import { FileText, Users, BarChart2, CheckCircle } from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const estadisticas = [
    {
      titulo: "Solicitudes Pendientes",
      valor: "12",
      icono: FileText,
      color: "bg-yellow-500",
      enlace: "/organismo/solicitudes"
    },
    {
      titulo: "Usuarios Registrados",
      valor: "248",
      icono: Users,
      color: "bg-blue-500",
      enlace: "/organismo/usuarios"
    },
    {
      titulo: "Organizaciones Aprobadas",
      valor: "45",
      icono: CheckCircle,
      color: "bg-green-500",
      enlace: "/organismo/reportes"
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 space-y-8 w-full">
      {/* Panel de bienvenida */}
      <section className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Panel de Control - Organismo Electoral
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Gestiona las solicitudes de registro de organizaciones políticas y supervisa el proceso de validación.
        </p>
      </section>

      {/* Estadísticas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: '20px' }} >
        {estadisticas.map((stat, index) => {
          const IconComponent = stat.icono;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(stat.enlace)}
            >
              <div className="flex items-center justify-between" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p className="text-sm text-gray-600">{stat.titulo}</p>
                  <p className="text-4xl font-extrabold text-gray-800">{stat.valor}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Acciones Rápidas */}
      <section className="bg-white rounded-xl shadow p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
          <button
            onClick={() => navigate("/organismo/solicitudes")}
            className="p-5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-left"
          >
            <FileText className="h-6 w-6 text-blue-300 mb-2" />
            <h3 className="font-semibold text-blue-300">Revisar Solicitudes</h3>
            <p className="text-sm text-blue-300">Aprobar o rechazar solicitudes pendientes</p>
          </button>

          <button
            onClick={() => navigate("/organismo/usuarios")}
            className="p-5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all text-left"
          >
            <Users className="h-6 w-6 text-green-300 mb-2" />
            <h3 className="font-semibold text-green-300">Gestionar Usuarios</h3>
            <p className="text-sm text-green-300">Administrar cuentas de organizaciones</p>
          </button>

          <button
            onClick={() => navigate("/organismo/reportes")}
            className="p-5 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-left"
          >
            <BarChart2 className="h-6 w-6 text-purple-300 mb-2" />
            <h3 className="font-semibold text-purple-300">Ver Reportes</h3>
            <p className="text-sm text-purple-300">Estadísticas y análisis del sistema</p>
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
