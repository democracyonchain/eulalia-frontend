import { useEffect, useState } from "react";
import { fetchSolicitudes, actualizarEstadoSolicitud } from "@/services/solicitudService";
import type { SolicitudOrganizacionFull } from "@/types/SolicitudOrganizacionFull";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/Card";




function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudOrganizacionFull[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await fetchSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error al obtener solicitudes", error);
    }
  };

  const manejarAccion = async (id: number, estado: "aprobado" | "rechazado") => {
    if (!confirm(`¿Estás seguro de ${estado === "aprobado" ? "aprobar" : "rechazar"} esta solicitud?`)) return;
    try {
      setLoadingId(id);
      await actualizarEstadoSolicitud(id, estado);
      await cargarSolicitudes();
      toast.success("✅ Solicitud actualizada correctamente");
    } catch (error) {
      alert("❌ Error al actualizar el estado.");
      toast.error("❌ Error al actualizar el estado");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Solicitudes</h2>
      <p className="mb-6 text-gray-600">Aquí podrás revisar y aprobar las solicitudes de registro de organizaciones políticas.</p>

      <div className="space-y-6">
        {solicitudes.map((s) =>
          !s.organizacion ? (
            <div
              key={s.solicitud_Id}
              className="border border-red-300 bg-red-50 text-red-700 p-4 rounded flex items-center gap-2"
            >
              <span>⚠️</span>
              <span><strong>Solicitud #{s.solicitud_Id}</strong> no tiene datos de organización.</span>
            </div>
          ) : (
            <Card key={s.solicitud_Id}>
              <CardHeader>
                <CardTitle>Solicitud #{s.solicitud_Id}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Organización</p>
                    <p className="font-semibold">{s.organizacion.nombre || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p>{s.organizacion.tipo_Organizacion || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${
                      s.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : s.estado === "aprobado"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}>
                      {s.estado?.toUpperCase() ?? "—"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha Solicitud</p>
                    <p>{new Date(s.fechaSolicitud).toLocaleString()}</p>
                  </div>
                  {s.fechaRevision && (
                    <div>
                      <p className="text-sm text-gray-500">Fecha Revisión</p>
                      <p>{new Date(s.fechaRevision).toLocaleString()}</p>
                    </div>
                  )}
                  {s.organizacion.responsable && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Responsable</p>
                      <p className="font-medium">{`${s.organizacion.responsable.nombre} ${s.organizacion.responsable.apellido}`}</p>
                      <p className="text-xs text-gray-500">{s.organizacion.responsable.cedula}</p>
                    </div>
                  )}
                </div>

                {s.observaciones && (
                  <p className="mt-4 text-sm text-gray-700">
                    <span className="font-medium">Observaciones:</span> {s.observaciones}
                  </p>
                )}
              </CardContent>

              {s.estado === "pendiente" && (
                <CardFooter>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => manejarAccion(s.solicitud_Id, "aprobado")}
                      disabled={loadingId === s.solicitud_Id}
                    >
                      {loadingId === s.solicitud_Id && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => manejarAccion(s.solicitud_Id, "rechazado")}
                      disabled={loadingId === s.solicitud_Id}
                    >
                      {loadingId === s.solicitud_Id && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                      Rechazar
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )
        )}
      </div>
    </div>
  );
}

export default SolicitudesPage;
