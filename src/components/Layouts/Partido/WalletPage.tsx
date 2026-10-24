import { useEffect, useRef, useState } from "react";
import { Download, Loader2, ShieldCheck, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  associateOrganizacionDid,
  associateOrganizacionHolderConnection,
  confirmOrganizacionCredentialReceipt,
  createOrganizacionHolderInvitation,
  fetchOrganizacionHolderConnectionStatus,
  fetchOrganizacionIdentidad,
  recoverOrganizacionHolderConnection,
  retryOrganizacionCredential,
  type OrganizacionIdentidadDto,
} from "@/services/organizacionService";
import {
  createOrganizationWallet,
  downloadWalletBackup,
  exportOrganizationWallet,
  importOrganizationWallet,
  parseAndAcceptInvitation,
  startWalletMessageListener,
  startWalletMessagePolling,
  stopWalletMessagePolling,
  validateWalletDid,
  waitForWalletConnection,
  type OrganizationWallet,
} from "@/services/organizationWallet";

const unavailable = "No disponible todavía";
const CREDENTIAL_RETRY_AFTER_MS = 3 * 60 * 1000;
const CONNECTION_RECOVERY_TIMEOUT_MS = 60 * 1000;
const isCredentialRecoveryEligible = (status: string | null | undefined) =>
  status === "credential_issued_pending_holder_receipt" || status === "offer_pending_holder_acceptance";

const sanitizeInvitationError = (caught: unknown) => {
  const message = caught instanceof Error ? caught.message : "";
  if (!message) return "No se recibió un detalle del error.";

  return message
    .replace(/\bhttps?:\/\/[^\s"'<>]+/gi, (value) => {
      try {
        const url = new URL(value.replace(/[),.;]+$/, ""));
        const suffix = value.slice(url.toString().length);
        url.search = "";
        url.hash = "";
        return `${url.toString()}${suffix}`;
      } catch {
        return "[URL omitida]";
      }
    })
    .replace(/([?&\s]|^)([_-]?oob|token|access_token|refresh_token|invitation(?:Url)?)[=:\s]+[^\s&"'<>]+/gi, "$1$2=[omitido]")
    .replace(/(["'])([_-]?oob|token|access_token|refresh_token|invitation(?:Url)?)(\1\s*:\s*\1)[^"']*\1/gi, "$1$2$3[omitido]$1");
};

const invitationStageError = (stage: string, caught: unknown) =>
  `${stage}: ${sanitizeInvitationError(caught)}`;

const apiErrorMessage = (caught: unknown) => {
  const response = (caught as { response?: { status?: number; data?: unknown } })?.response;
  const data = response?.data;
  const detail = typeof data === "string"
    ? data
    : data && typeof data === "object"
      ? ((data as { message?: unknown; title?: unknown; detail?: unknown }).message
        ?? (data as { title?: unknown }).title
        ?? (data as { detail?: unknown }).detail)
      : undefined;
  const status = response?.status ? `HTTP ${response.status}` : "";
  const message = detail ? String(detail) : caught instanceof Error ? caught.message : "";
  return sanitizeInvitationError([status, message].filter(Boolean).join(": ") || "No se recibió un detalle del error.");
};

function WalletPage() {
  const [wallet, setWallet] = useState<OrganizationWallet | null>(null);
  const [identity, setIdentity] = useState<OrganizacionIdentidadDto | null>(null);
  const [password, setPassword] = useState("");
  const [backupReady, setBackupReady] = useState(false);
  const [invitation, setInvitation] = useState("");
  const invitationIdRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const credentialRetryStartedAtRef = useRef<number | null>(null);
  const credentialRecoveryAttemptedRef = useRef(false);
  const credentialRecoveryInProgressRef = useRef(false);
  const identityRef = useRef<OrganizacionIdentidadDto | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async (silent = false) => {
    try {
      const nextIdentity = await fetchOrganizacionIdentidad();
      identityRef.current = nextIdentity;
      setIdentity(nextIdentity);
      if (isCredentialRecoveryEligible(nextIdentity.estadoCredencial)) {
        credentialRetryStartedAtRef.current ??= Date.now();
      } else {
        credentialRetryStartedAtRef.current = null;
      }
      return nextIdentity;
    } catch {
      if (!silent) setError("No se pudo cargar el estado de la organización.");
      return null;
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    if (!wallet) return undefined;
    let disposed = false;
    const recoveryAbortController = new AbortController();
    const removeListener = startWalletMessageListener(wallet, () => {
      void (async () => {
        try {
          await confirmOrganizacionCredentialReceipt();
          setMessage("La wallet recibió la credencial y el backend confirmó la recepción.");
        } catch (caught) {
          setError(`La wallet recibió la credencial, pero no se pudo confirmar en el backend: ${apiErrorMessage(caught)}`);
        }
        await load();
      })();
    });
    void (async () => {
      try {
        await startWalletMessagePolling(wallet);
      } catch (caught) {
        if (!disposed) setError(`La wallet no pudo iniciar la escucha DIDComm: ${apiErrorMessage(caught)}`);
      }
    })();

    const recoverConnectionAndRetry = async () => {
      if (disposed || credentialRecoveryInProgressRef.current || credentialRecoveryAttemptedRef.current) return;
      credentialRecoveryInProgressRef.current = true;
      credentialRecoveryAttemptedRef.current = true;

      try {
        setMessage("Se agotó la espera inicial. Recuperando conexión DIDComm sin cambiar la wallet...");
        const recovery = await recoverOrganizacionHolderConnection();
        if (recovery.connected) {
          setMessage("La conexión DIDComm está establecida. Creando una oferta nueva...");
        } else if (recovery.invitationUrl) {
          const connectionReady = waitForWalletConnection(
            wallet,
            async () => (await fetchOrganizacionHolderConnectionStatus()).connected,
            CONNECTION_RECOVERY_TIMEOUT_MS,
            recoveryAbortController.signal,
           );
           invitationIdRef.current = recovery.invitationId ?? recovery.holderConnectionId;
           await parseAndAcceptInvitation(wallet, recovery.invitationUrl);
           if (!invitationIdRef.current) {
             throw new Error("La recuperación no devolvió una referencia de conexión válida.");
           }
           // The recovery endpoint temporarily stores the invitation ID. Once
           // the wallet accepts it, associate that connection before polling;
           // otherwise the backend keeps checking the previous stale ID.
           await associateOrganizacionHolderConnection(invitationIdRef.current);
           setMessage("Invitación de recuperación aceptada. Esperando la confirmación de conexión DIDComm...");
          if (!(await connectionReady)) {
            setMessage("La recuperación quedó pendiente de confirmación DIDComm. La wallet continuará escuchando sin crear otra invitación.");
            return;
          }
          setMessage("Conexión DIDComm recuperada. Creando una oferta nueva...");
        } else {
          setMessage("La recuperación no devolvió una invitación. La wallet continuará escuchando sin crear otra.");
          return;
        }

        await retryOrganizacionCredential();
        if (!disposed) {
          setMessage("Oferta nueva creada. Escuchando wallet para recibirla.");
          await load(true);
        }
      } catch (caught) {
        if (!disposed) setError(`No se pudo completar la recuperación automática de la conexión: ${apiErrorMessage(caught)}`);
      } finally {
        credentialRecoveryInProgressRef.current = false;
      }
    };

    const statusTimer = window.setInterval(() => {
       void load(true).then(async (current) => {
         if (!isCredentialRecoveryEligible(current?.estadoCredencial) ||
             credentialRecoveryAttemptedRef.current ||
             credentialRetryStartedAtRef.current === null) return;

         // A recovered terminal connection does not need the three-minute
         // stale-connection timeout. Reoffer immediately on that connection.
         let connected = false;
         try {
           connected = (await fetchOrganizacionHolderConnectionStatus()).connected;
         } catch {
           // Keep the timeout fallback for a temporarily unavailable status endpoint.
         }
         if (!connected && Date.now() - credentialRetryStartedAtRef.current < CREDENTIAL_RETRY_AFTER_MS) return;

         await recoverConnectionAndRetry();
       });
    }, 5_000);
    return () => {
      disposed = true;
      recoveryAbortController.abort();
      removeListener();
      window.clearInterval(statusTimer);
      stopWalletMessagePolling(wallet);
      void wallet.agent.stop();
    };
  }, [wallet]);

  const createWallet = async () => {
    setBusy(true); setError(null); setMessage(null);
    try { setWallet(await createOrganizationWallet()); setMessage("Wallet Identus creada localmente. Descargá el respaldo cifrado antes de asociar el DID."); }
    catch (caught) { setError(`No se pudo crear la wallet Identus en este navegador: ${apiErrorMessage(caught)}`); } finally { setBusy(false); }
  };

  const backup = async () => {
    if (!wallet) return;
    setBusy(true); setError(null);
    try {
      downloadWalletBackup(await exportOrganizationWallet(wallet, password));
      setBackupReady(true); setPassword("");
      setMessage("Respaldo Identus cifrado descargado. Guardalo fuera de este dispositivo: perderlo implica perder el control de la wallet.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo crear el respaldo."); }
    finally { setBusy(false); }
  };

  const connect = async () => {
    if (!wallet || !backupReady) return;
    setBusy(true); setError(null);
    try {
      if (!validateWalletDid(wallet.did)) throw new Error("El DID de la wallet no tiene un formato válido.");
      await associateOrganizacionDid(wallet.did); await load(); setMessage("DID público asociado. La clave privada permanece en la wallet Identus.");
    }
    catch (caught) { setError(`No se pudo asociar el DID público con la organización: ${apiErrorMessage(caught)}`); } finally { setBusy(false); }
  };

  const acceptInvitation = async () => {
    if (!wallet || !invitation.trim()) return;
    setBusy(true); setError(null);
    try {
      try {
        await parseAndAcceptInvitation(wallet, invitation);
      } catch (caught) {
        setError(invitationStageError("DIDComm no pudo interpretar o aceptar la invitación", caught));
        return;
      }

      try {
        if (!invitationIdRef.current) throw new Error("La invitación no tiene una referencia de conexión del backend.");
        await associateOrganizacionHolderConnection(invitationIdRef.current);
      } catch (caught) {
        setError(invitationStageError("DIDComm aceptó la invitación, pero no se pudo asociar la conexión con la organización", caught));
        return;
      }

      const connectionReady = await waitForWalletConnection(
        wallet,
        async () => (await fetchOrganizacionHolderConnectionStatus()).connected,
        CONNECTION_RECOVERY_TIMEOUT_MS,
      );
      if (!connectionReady) {
        await load();
        setMessage("Invitación DIDComm aceptada. La conexión aún está pendiente; no se emitirá la oferta hasta confirmarla.");
        return;
      }

      const currentIdentity = await load(true);
      if (isCredentialRecoveryEligible(currentIdentity?.estadoCredencial)) {
        await retryOrganizacionCredential();
        await load(true);
        setMessage("Conexión DIDComm confirmada. Oferta nueva creada; esperando que llegue a la wallet.");
      } else {
        setMessage("Invitación DIDComm aceptada y conexión asociada. Esperando la oferta de credencial.");
      }
    } finally { setBusy(false); }
  };

  const getInvitation = async () => {
    setBusy(true); setError(null);
    try { const result = await createOrganizacionHolderInvitation(); invitationIdRef.current = result.invitationId; setInvitation(result.invitationUrl); setMessage("Invitación CNE recibida. Revisala y aceptala desde esta wallet."); }
    catch (caught) { setError(`CNE todavía no pudo crear una invitación de holder: ${apiErrorMessage(caught)}`); } finally { setBusy(false); }
  };

  const importBackup = async (file: File) => {
    setBusy(true); setError(null);
    try { setWallet(await importOrganizationWallet(await file.text(), password)); setBackupReady(true); setPassword(""); setMessage("Wallet Identus recuperada en memoria. No se guardó la contraseña ni el respaldo en el navegador."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo importar el respaldo."); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <div><h1 className="text-2xl font-semibold text-slate-900">Wallet de organización</h1><p className="mt-1 text-slate-600">Wallet Identus en el navegador. Las claves privadas nunca se envían al backend.</p></div>
    <Card><CardHeader><CardTitle><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Estado de la wallet</span></CardTitle></CardHeader><CardContent className="space-y-4">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Descargá y protegé el respaldo cifrado antes de asociar el DID. Si perdés el respaldo, perdés el control de la wallet.</div>
      <div className="grid gap-4 md:grid-cols-2"><div><p className="text-sm text-slate-500">Estado</p><p className="font-medium">{wallet ? "Wallet Identus activa" : "Wallet no conectada"}</p></div><div><p className="text-sm text-slate-500">DID público</p><p className="break-all font-medium">{wallet?.did || identity?.clientDid || unavailable}</p></div></div>
      {wallet && <div className="space-y-3"><label className="block text-sm font-medium text-slate-700">Contraseña del respaldo cifrado<input type="password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border p-2" autoComplete="new-password" /></label><div className="flex flex-wrap gap-3"><button type="button" onClick={() => void backup()} disabled={busy || password.length < 12} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"><Download className="mr-2 inline h-4 w-4" />Descargar respaldo</button><button type="button" onClick={() => void connect()} disabled={busy || !backupReady} className="rounded border border-blue-700 px-4 py-2 text-blue-700 disabled:opacity-50">Asociar DID público</button></div></div>}
      {!wallet && <div className="space-y-3"><label className="block text-sm font-medium text-slate-700">Contraseña del respaldo<input type="password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border p-2" autoComplete="current-password" /></label><div className="flex flex-wrap gap-3"><button type="button" onClick={() => void createWallet()} disabled={busy} className="rounded bg-blue-700 px-4 py-2 text-white">Crear wallet Identus</button><button type="button" onClick={() => inputRef.current?.click()} disabled={busy || password.length < 12} className="rounded border border-slate-300 px-4 py-2"><Upload className="mr-2 inline h-4 w-4" />Importar respaldo</button><input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); event.target.value = ""; }} /></div></div>}
      {wallet && <div className="space-y-3 border-t pt-4"><h2 className="font-medium text-slate-900">Conexión DIDComm con CNE</h2><button type="button" onClick={() => void getInvitation()} disabled={busy || !backupReady} className="rounded border border-blue-700 px-4 py-2 text-blue-700 disabled:opacity-50">Obtener invitación CNE</button><textarea value={invitation} onChange={(event) => setInvitation(event.target.value)} placeholder="Pegá aquí una invitación OOB/DIDComm o una URL _oob" className="min-h-24 w-full rounded border p-2" /><button type="button" onClick={() => void acceptInvitation()} disabled={busy || !backupReady || !invitation.trim()} className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">Aceptar invitación DIDComm</button></div>}
      {busy && <p className="flex items-center gap-2 text-sm text-blue-700" role="status"><Loader2 className="h-4 w-4 animate-spin" />Procesando wallet...</p>}{message && <p className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">{message}</p>}{error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Estado de autorización CNE</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><p className="text-sm text-slate-500">Credencial</p><p>{identity?.estadoCredencial || "Wallet no conectada"}</p></div><div><p className="text-sm text-slate-500">Conexión</p><p>{identity?.estadoIdentidad || "Sin conexión confirmada"}</p></div></CardContent></Card>
  </div>;
}

export default WalletPage;
