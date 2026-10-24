import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { fetchOrganizacionDetail, type OrganizacionDto } from "@/services/organizacionService";
import { fetchAfiliaciones } from "@/services/afiliacionService";
import { FileText, Users, CheckCircle, AlertCircle } from "lucide-react";
import logger from "@/utils/logger";

function HomePage() {
  const { organizacionId } = useContext(AuthContext);
  const [orgDetail, setOrgDetail] = useState<OrganizacionDto | null>(null);
  const [totalAfiliadosActivos, setTotalAfiliadosActivos] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!organizacionId) return;
      try {
        const data = await fetchOrganizacionDetail(organizacionId);
        setOrgDetail(data);

        const afiliaciones = await fetchAfiliaciones();
        const activos = afiliaciones.filter(
          (a) => a.organizacionId === organizacionId && a.estado !== "Anulado"
        ).length;
        setTotalAfiliadosActivos(activos);
      } catch (err) {
        logger.error("Error al cargar dashboard de organización:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [organizacionId]);

  if (loading) return <div className="p-8 text-slate-600">Cargando panel de organización...</div>;

  const estadisticas = [
    {
      titulo: "Estado de Afiliación",
      valor: orgDetail?.estado || "Inactiva",
      icono: CheckCircle,
      color: orgDetail?.estado === "Aprobado" ? "text-green-600" : "text-yellow-600",
      bg: orgDetail?.estado === "Aprobado" ? "bg-green-100" : "bg-yellow-100"
    },
    {
      titulo: "Tipo de Organización",
      valor: orgDetail?.tipo || "No definido",
      icono: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      titulo: "Afiliados Activos",
      valor: totalAfiliadosActivos.toString(),
      icono: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    }
  ];

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Panel de Control: {orgDetail?.nombre || "Organización"}
        </h1>
        <p className="text-slate-500 mt-2">
          Gestione los datos, afiliados y reportes de su organización política.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {estadisticas.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icono size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.titulo}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.valor}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <AlertCircle className="text-blue-600" />
          Avisos del Sistema
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-800 text-sm">
            Recuerde que todas las altas de afiliados deben ser validadas por el CNE antes de ser oficiales.
          </div>
          <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded text-slate-600 text-sm">
            La próxima auditoría de padrones se realizará el 15 de marzo. Asegúrese de tener sus documentos al día.
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
