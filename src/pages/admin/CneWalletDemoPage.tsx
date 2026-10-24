import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, Square, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  createOrganizationWallet,
  parseAndAcceptInvitation,
  startWalletMessageListener,
  startWalletMessagePolling,
  stopWalletMessagePolling,
  waitForWalletConnection,
  type OrganizationWallet,
} from "@/services/organizationWallet";
import { ListenerKey } from "@hyperledger/identus-sdk";
import logger from "@/utils/logger";

type ConnectionState = "sin iniciar" | "esperando" | "conectada" | "pendiente";
type CredentialState = "sin iniciar" | "esperando" | "recibida";

const isOobInvitation = (value: string) => {
  try {
    const url = new URL(value.trim());
    return (url.protocol === "http:" || url.protocol === "https:")
      && Boolean(url.searchParams.get("_oob"));
  } catch {
    return false;
  }
};

const getErrorMessage = (caught: unknown) =>
  caught instanceof Error ? caught.message : "No se pudo completar la operación de la wallet.";

function CneWalletDemoPage() {
  const [wallet, setWallet] = useState<OrganizationWallet | null>(null);
  const [invitation, setInvitation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("sin iniciar");
  const [credentialState, setCredentialState] = useState<CredentialState>("sin iniciar");
  const connectionObservedRef = useRef(false);
  const acceptingInvitationRef = useRef(false);

  useEffect(() => {
    if (!wallet) return undefined;
    let disposed = false;
    const onConnection = () => {
      connectionObservedRef.current = true;
      logger.info("SSI wallet UI: evento de conexión DIDComm recibido");
      if (!disposed) setConnectionState("conectada");
    };
    const removeMessageListener = startWalletMessageListener(wallet, () => {
      if (!disposed) {
        setCredentialState("recibida");
        setMessage("Credencial procesada por la wallet Identus. La recepción DIDComm fue exitosa.");
      }
    });
    wallet.agent.events.addListener(ListenerKey.CONNECTION, onConnection);

    void (async () => {
      try {
      await startWalletMessagePolling(wallet);
        if (disposed) stopWalletMessagePolling(wallet);
      } catch (caught) {
        if (!disposed) setError(`No se pudo iniciar la escucha DIDComm: ${getErrorMessage(caught)}`);
      }
    })();

    return () => {
      disposed = true;
      removeMessageListener();
      wallet.agent.events.removeListener(ListenerKey.CONNECTION, onConnection);
      stopWalletMessagePolling(wallet);
      void wallet.agent.stop();
    };
  }, [wallet]);

  const initializeWallet = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const nextWallet = await createOrganizationWallet();
      setWallet(nextWallet);
      setConnectionState("sin iniciar");
      setCredentialState("sin iniciar");
      setMessage("Wallet Identus inicializada en memoria para esta demostración.");
    } catch (caught) {
      setError(`No se pudo inicializar la wallet Identus: ${getErrorMessage(caught)}`);
    } finally {
      setBusy(false);
    }
  };

  const acceptInvitation = async () => {
    if (!wallet || acceptingInvitationRef.current || connectionState === "conectada") return;
    if (!isOobInvitation(invitation)) {
      setError("Pegá una URL HTTP(S) válida que contenga el parámetro _oob.");
      return;
    }

    acceptingInvitationRef.current = true;
    setBusy(true);
    setError(null);
    setMessage(null);
    setConnectionState("esperando");
    setCredentialState("esperando");
    connectionObservedRef.current = false;
    try {
      logger.info("SSI wallet UI: esperando confirmación de conexión");
      await parseAndAcceptInvitation(wallet, invitation);
      const connected = await waitForWalletConnection(
        wallet,
        async () => connectionObservedRef.current,
      );
      if (connected) {
        logger.info("SSI wallet UI: conexión confirmada, esperando oferta de credencial");
        setConnectionState("conectada");
        setMessage("Conexión DIDComm establecida. Esperando la credencial.");
      } else {
        logger.info("SSI wallet UI: invitación aceptada, conexión todavía pendiente");
        setConnectionState("pendiente");
        setMessage("La invitación fue aceptada, pero la conexión aún está pendiente.");
      }
    } catch (caught) {
      logger.warn("SSI wallet UI: falló la aceptación de invitación", {
        error: caught instanceof Error ? caught.message : String(caught),
      });
      setConnectionState("pendiente");
      setCredentialState("sin iniciar");
      setError(`No se pudo aceptar la invitación: ${getErrorMessage(caught)}`);
    } finally {
      acceptingInvitationRef.current = false;
      setBusy(false);
    }
  };

  const stopWallet = () => {
    acceptingInvitationRef.current = false;
    setWallet(null);
    setConnectionState("sin iniciar");
    setCredentialState("sin iniciar");
    setMessage("Wallet detenida y agente DIDComm desconectado.");
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Billetera SSI de demostración</h1>
        <p className="mt-1 text-slate-600">Holder wallet CNE para observar el flujo DIDComm del video.</p>
      </div>

      <Card>
        <CardHeader><CardTitle><span className="flex items-center gap-2"><WalletCards className="h-5 w-5" />Wallet y conexión</span></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            Esta es una wallet holder de demostración del CNE. Vive solo en memoria del navegador y no confirma autorización ciudadana ni afiliación.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-sm text-slate-500">Wallet</p><p className="font-medium">{wallet ? "Inicializada" : "No inicializada"}</p></div>
            <div><p className="text-sm text-slate-500">Conexión DIDComm</p><p className="font-medium capitalize">{connectionState}</p></div>
            <div><p className="text-sm text-slate-500">Credencial</p><p className="font-medium capitalize">{credentialState}</p></div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!wallet ? (
              <button type="button" onClick={() => void initializeWallet()} disabled={busy} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">
                <ShieldCheck className="mr-2 inline h-4 w-4" />Inicializar billetera
              </button>
            ) : (
              <button type="button" onClick={stopWallet} disabled={busy} className="rounded border border-red-300 px-4 py-2 text-red-700 disabled:opacity-50">
                <Square className="mr-2 inline h-4 w-4" />Detener billetera
              </button>
            )}
          </div>

          <div className="space-y-3 border-t pt-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="cne-invitation">URL de invitación OOB</label>
            <textarea id="cne-invitation" value={invitation} onChange={(event) => setInvitation(event.target.value)} disabled={!wallet || busy} placeholder="Pegá aquí la URL HTTP(S) con parámetro _oob" className="min-h-28 w-full rounded border p-2 disabled:bg-slate-100" />
            <button
              type="button"
              onClick={() => void acceptInvitation()}
              disabled={!wallet || busy || connectionState === "conectada" || !invitation.trim()}
              className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
            >
              {connectionState === "conectada" ? "Invitación aceptada" : "Aceptar invitación"}
            </button>
          </div>

          {busy && <p className="flex items-center gap-2 text-sm text-blue-700" role="status"><Loader2 className="h-4 w-4 animate-spin" />Procesando wallet...</p>}
          {message && <p className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">{message}</p>}
          {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export default CneWalletDemoPage;
