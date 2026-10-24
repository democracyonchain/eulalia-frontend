import { useContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { fetchOrganizacionIdentidad, type OrganizacionIdentidadDto } from "@/services/organizacionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const unavailable = "No disponible todavía";

const statusLabel = (status: string | null | undefined) => {
  switch (status) {
    case "publication_requested":
      return "Publicación solicitada a Identus";
    case "published":
      return "DID publicado";
    case "credential_pending":
      return "Credencial pendiente de emisión";
    case "offer_pending_holder_acceptance":
      return "Oferta pendiente de aceptación en la wallet";
    case "completed":
      return "Identidad y credencial completas";
    case "failed":
      return "Error durante la provisión de identidad";
    case "wallet_not_connected":
      return "Wallet no conectada";
    case "wallet_connected":
      return "Wallet conectada; autorización CNE pendiente";
    default:
      return status || unavailable;
  }
};

function IdentidadPage() {
  const { organizacionId } = useContext(AuthContext);
  const [identity, setIdentity] = useState<OrganizacionIdentidadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIdentity = async () => {
      try {
        setError(null);
        setIdentity(await fetchOrganizacionIdentidad());
      } catch {
        setError("No se pudo cargar la identidad de la organización.");
      } finally {
        setLoading(false);
      }
    };

    if (organizacionId) loadIdentity();
    else setLoading(false);
  }, [organizacionId]);

  const valueOrUnavailable = (value: string | null | undefined) => value || unavailable;

  if (loading) {
    return <div className="flex items-center gap-2 p-6 text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />Cargando identidad digital...</div>;
  }

  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if (!identity) return <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">No hay una organización asociada a esta cuenta.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Identidad Digital</h1>
        <p className="mt-1 text-slate-600">Información pública y estado de identidad de la organización.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Organización</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><p className="text-sm text-slate-500">Nombre</p><p className="font-medium text-slate-900">{identity.nombre}</p></div>
          <div><p className="text-sm text-slate-500">ID de organización</p><p className="font-medium text-slate-900">{identity.organizacionId}</p></div>
          <div><p className="text-sm text-slate-500">Estado de aprobación</p><p className="font-medium text-slate-900">{identity.estadoAprobacion || unavailable}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Credenciales e identidad</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
           <div><p className="text-sm text-slate-500">DID público de la wallet</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.clientDid || identity.did)}</p></div>
           <div><p className="text-sm text-slate-500">Estado de identidad</p><p className="font-medium text-slate-900">{statusLabel(identity.estadoIdentidad)}</p></div>
           <div><p className="text-sm text-slate-500">Estado de credencial</p><p className="font-medium text-slate-900">{statusLabel(identity.estadoCredencial)}</p></div>
          <div><p className="text-sm text-slate-500">DID long-form</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.longFormDid)}</p></div>
          <div><p className="text-sm text-slate-500">DID publicado</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.publishedDid)}</p></div>
          <div><p className="text-sm text-slate-500">Referencia del emisor</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.referenciaEmisor)}</p></div>
          <div><p className="text-sm text-slate-500">Referencia de operación</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.referenciaOperacion)}</p></div>
          <div><p className="text-sm text-slate-500">Registro de credencial</p><p className="break-all font-medium text-slate-900">{valueOrUnavailable(identity.credentialRecordId)}</p></div>
          <div><p className="text-sm text-slate-500">Creado</p><p className="font-medium text-slate-900">{identity.creadoEn ? new Date(identity.creadoEn).toLocaleString() : unavailable}</p></div>
          <div><p className="text-sm text-slate-500">Actualizado</p><p className="font-medium text-slate-900">{identity.actualizadoEn ? new Date(identity.actualizadoEn).toLocaleString() : unavailable}</p></div>
          {identity.error && <div className="md:col-span-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900"><p className="text-sm font-medium">Detalle del estado</p><p>{identity.error}</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}

export default IdentidadPage;
