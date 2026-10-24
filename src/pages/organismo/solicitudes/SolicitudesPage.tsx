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




type SolicitudesPageProps = {
  reviewer?: "CNE" | "Organismo";
};

const identityStatusLabel = (status?: string) => {
  switch (status) {
    case "publication_requested":
      return "DID creado; publicación solicitada a Identus";
    case "published":
      return "DID publicado en Identus";
    case "credential_pending":
      return "credencial del CNE pendiente de emisión";
    case "offer_pending_holder_acceptance":
      return "oferta pendiente de aceptación del holder";
    case "completed":
      return "identidad y credencial completadas";
    case "failed":
      return "falló la provisión de identidad";
    default:
      return status || "sin resultado de identidad";
  }
};

function SolicitudesPage({ reviewer = "Organismo" }: SolicitudesPageProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudOrganizacionFull[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [processingAction, setProcessingAction] = useState<"aprobado" | "rechazado" | null>(null);
  const [actionResult, setActionResult] = useState<Record<number, { status?: string; credentialStatus?: string; message?: string; error?: string }>>({});

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
    if (loadingId !== null) return;
    const actionLabel = reviewer === "CNE" && estado === "aprobado" ? "pre-aprobar" : estado === "aprobado" ? "aprobar" : "rechazar";
    if (!confirm(`¿Estás seguro de ${actionLabel} esta solicitud?`)) return;
    try {
      setLoadingId(id);
      setProcessingAction(estado);
      const response = await actualizarEstadoSolicitud(id, estado);
      await cargarSolicitudes();
      setActionResult((previous) => ({ ...previous, [id]: {
        status: response?.identityStatus,
        credentialStatus: response?.credentialStatus
      }}));
       toast.success(response?.identityStatus === "failed" ? "La identidad falló" : "Solicitud actualizada correctamente");
    } catch (error: any) {
      const responseData = error?.response?.data;
      const message = responseData?.message || "Error al actualizar el estado";
      const pendingCredential = error?.response?.status === 409 && responseData?.error === "credential_pending";
      setActionResult((previous) => ({ ...previous, [id]: {
        status: pendingCredential ? "credential_pending" : "failed",
        message: pendingCredential ? message : undefined,
        error: pendingCredential ? undefined : message
      }}));
      if (pendingCredential) {
        toast.info("La solicitud permanece pendiente: falta completar la configuración de emisión de la credencial en Identus.", { autoClose: 9000 });
      } else {
        toast.error(message);
      }
    } finally {
      setLoadingId(null);
      setProcessingAction(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {reviewer === "CNE" ? "Revisión CNE de solicitudes de organizaciones" : "Gestión de Solicitudes"}
      </h2>
      <p className="mb-6 text-gray-600">
        {reviewer === "CNE"
          ? "Revise y pre-apruebe las solicitudes de registro de organizaciones políticas. La pre-aprobación utiliza el estado persistido aprobado."
          : "Aquí podrás revisar y aprobar las solicitudes de registro de organizaciones políticas."}
      </p>

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
                {loadingId === s.solicitud_Id && (
                  <div className="mt-4 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800" role="status">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{reviewer === "CNE" && processingAction === "aprobado" ? "Procesando pre-aprobación..." : "Procesando solicitud..."}</span>
                  </div>
                )}
                {actionResult[s.solicitud_Id] && (
                  <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700" role="status">
                     Resultado de identidad: <strong>{identityStatusLabel(actionResult[s.solicitud_Id].status)}</strong>
                     {actionResult[s.solicitud_Id].credentialStatus && ` · ${identityStatusLabel(actionResult[s.solicitud_Id].credentialStatus)}`}
                     {actionResult[s.solicitud_Id].message && <span className="block">{actionResult[s.solicitud_Id].message}</span>}
                     {actionResult[s.solicitud_Id].error && <span className="block text-red-700">{actionResult[s.solicitud_Id].error}</span>}
                  </div>
                )}
              </CardContent>

              {s.estado === "pendiente" && (
                <CardFooter>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => manejarAccion(s.solicitud_Id, "aprobado")}
                      disabled={loadingId === s.solicitud_Id}
                    >
                      {loadingId === s.solicitud_Id && processingAction === "aprobado" && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                       {reviewer === "CNE" ? "Pre-aprobar" : "Aprobar"}
                    </Button>
                    <Button
                      onClick={() => manejarAccion(s.solicitud_Id, "rechazado")}
                      disabled={loadingId === s.solicitud_Id}
                    >
                      {loadingId === s.solicitud_Id && processingAction === "rechazado" && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
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
