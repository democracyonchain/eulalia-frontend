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


      
    </div>
  );
}

export default HomePage;
