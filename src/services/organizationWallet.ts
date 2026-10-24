import {
  Agent,
  Apollo,
  Domain,
  ListenerKey,
  Pluto,
  X25519PrivateKey,
  type Agent as IdentusAgent,
  type MessageEventArg,
} from "@hyperledger/identus-sdk";
import type {
  w as Api,
  W as ApiResponse,
  Y as HttpMethod,
} from "../../node_modules/@hyperledger/identus-sdk/build/PluginManager-Dmq43fZB";
import {
  IssueCredential,
  OfferCredential,
  PickupReceived,
  PickupRequest,
} from "@hyperledger/identus-sdk/plugins/didcomm";
import logger from "../utils/logger";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const BACKUP_TYPE = "eulalia-identus-organization-wallet";
const BACKUP_VERSION = 2;
const LEGACY_BACKUP_MESSAGE = "Este respaldo fue creado con un formato antiguo incompatible. Creá un respaldo nuevo para poder restaurarlo.";
const PBKDF2_ITERATIONS = 310_000;
const MEDIATOR_SDK_URL = "http://host.docker.internal:8081";
const CLOUD_AGENT_SDK_URL = "http://host.docker.internal:8080";
const walletPollingStates = new WeakMap<IdentusAgent, { timer: number; busy: boolean }>();

export type OrganizationWallet = {
  did: string;
  agent: IdentusAgent;
};

type EncryptedBackup = {
  version: number;
  type: typeof BACKUP_TYPE;
  salt: string;
  iv: string;
  encryptedJwe: string;
  iterations: number;
};

const toBase64 = (value: ArrayBuffer | Uint8Array) => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const deriveBackupKey = async (password: string, salt: Uint8Array, iterations: number) => {
  const material = await crypto.subtle.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

const deriveBackupJweKey = async (password: string, salt: Uint8Array, iterations: number) => {
  const material = await crypto.subtle.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const jweSalt = new Uint8Array(salt.length + 1);
  jweSalt.set(salt);
  jweSalt[salt.length] = 1;
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: jweSalt, iterations, hash: "SHA-256" },
    material,
    256,
  );
  return X25519PrivateKey.from.Buffer(Buffer.from(bits));
};

const validatePassword = (password: string) => {
  if (password.length < 12) throw new Error("La contraseña de respaldo debe tener al menos 12 caracteres.");
};

const fetchMediatorDID = async () => {
  const mediatorResponse = await fetch("/mediator/did");
  if (!mediatorResponse.ok) throw new Error("No se pudo obtener el DID del mediador DIDComm.");
  const mediatorDID = (await mediatorResponse.text()).trim();
  if (!mediatorDID) throw new Error("El mediador DIDComm no devolvió un DID válido.");
  return mediatorDID;
};

const createBrowserMediatorApi = (getAgent: () => IdentusAgent | undefined): Api => ({
  async request<T>(
    method: HttpMethod,
    url: string,
    urlParameters?: Map<string, string>,
    httpHeaders?: Map<string, string>,
    body?: string | Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const originalUrl = new URL(url);
    const requestUrl = originalUrl.origin === MEDIATOR_SDK_URL
      ? new URL(`/mediator${originalUrl.pathname}`, window.location.origin)
      : originalUrl.origin === CLOUD_AGENT_SDK_URL
        ? new URL(originalUrl.pathname, window.location.origin)
      : originalUrl;
    requestUrl.hash = originalUrl.hash;
    originalUrl.searchParams.forEach((value, key) => requestUrl.searchParams.set(key, value));

    urlParameters?.forEach((value, key) => requestUrl.searchParams.set(key, value));
    const headers = new Headers(httpHeaders ? Object.fromEntries(httpHeaders) : undefined);
    if (requestUrl.pathname.startsWith("/didcomm")) {
      headers.set("Content-Type", "application/didcomm-encrypted+json");
    }

    const response = await fetch(requestUrl, {
      method,
      headers,
      body: typeof body === "string" || body === undefined ? body : JSON.stringify(body),
    });
     const responseText = await response.text();
    let responseBody: unknown = responseText;
    try {
      responseBody = responseText ? JSON.parse(responseText) : responseText;
    } catch {
      // Keep non-JSON mediator responses as text.
    }

      const status = response.status;
      const responseShape = Array.isArray(responseBody)
        ? { kind: "array", length: responseBody.length }
        : responseBody && typeof responseBody === "object"
          ? { kind: "object", keys: Object.keys(responseBody as Record<string, unknown>).sort() }
          : { kind: typeof responseBody, length: typeof responseBody === "string" ? responseBody.length : undefined };
      logger.info("Respuesta del mediador DIDComm", {
        method,
        path: requestUrl.pathname,
        status,
        responseShape,
      });
      if (!response.ok) {
        logger.error("Error HTTP en mensajería DIDComm", {
          method,
          path: requestUrl.pathname,
          status,
          responseBody,
        });
      }
      if (status === 200 && responseShape.kind === "object") {
        const agent = getAgent();
        if (agent) {
          void agent.mercury.unpackMessage(JSON.stringify(responseBody))
            .then(async (message) => {
              logger.info("Mensaje DIDComm desempaquetado", {
                piuri: message.piuri,
                attachmentCount: message.attachments.length,
              });
              if (message.piuri === "https://didcomm.org/messagepickup/3.0/delivery") {
                for (const [index, attachment] of message.attachments.entries()) {
                  try {
                    const attachedMessage = await agent.mercury.unpackMessage(JSON.stringify(attachment.payload));
                    logger.info("Adjunto DIDComm desempaquetado", {
                      index,
                      piuri: attachedMessage.piuri,
                    });
                  } catch (caught) {
                    logger.warn("No se pudo desempaquetar un adjunto DIDComm", {
                      index,
                      error: caught instanceof Error ? caught.message : String(caught),
                    });
                  }
                }
              }
            })
            .catch((caught) => logger.warn("No se pudo desempaquetar la respuesta DIDComm del mediador", {
              error: caught instanceof Error ? caught.message : String(caught),
            }));
        }
      }
      return {
      body: responseBody as T,
      status,
      statusText: response.statusText,
      headers: response.headers,
      get httpStatus() { return status; },
    };
  },
});

const createMediatorService = (mediatorDID: string) =>
  new Domain.DIDDocument.Service(
    "#didcomm-1",
    "DIDCommMessaging",
    new Domain.DIDDocument.ServiceEndpoint("http://host.docker.internal:8081", ["didcomm/v2"], [`${mediatorDID}#key-1`]),
  );

const normalizeRoutingKey = (routingKey: string) => routingKey.trim().replace(/\/$/, "");

const getEndpointDetails = (endpoint: unknown) => {
  if (typeof endpoint === "string") return { uri: endpoint, accept: [], routingKeys: [] };
  if (!endpoint || typeof endpoint !== "object") return null;

  const value = endpoint as { uri?: unknown; url?: unknown; accept?: unknown; routingKeys?: unknown };
  const uri = typeof value.uri === "string" ? value.uri : typeof value.url === "string" ? value.url : "";
  const accept = Array.isArray(value.accept)
    ? value.accept.filter((item): item is string => typeof item === "string")
    : typeof value.accept === "string" ? [value.accept] : [];
  const routingKeys = Array.isArray(value.routingKeys)
    ? value.routingKeys.filter((item): item is string => typeof item === "string")
    : typeof value.routingKeys === "string" ? [value.routingKeys] : [];

  return { uri, accept, routingKeys };
};

const isUsableDIDCommEndpoint = (endpoint: unknown) => {
  const details = getEndpointDetails(endpoint);
  if (!details?.uri) return false;

  try {
    const parsed = new URL(details.uri);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const createAgent = async (databaseName: string) => {
  const apollo = new Apollo();
  const pluto = await Pluto.create({ dbName: databaseName, keyRestoration: apollo });
  const mediatorDID = await fetchMediatorDID();
  let agent: IdentusAgent | undefined;
  const initializedAgent = Agent.initialize({ pluto, mediatorDID, api: createBrowserMediatorApi(() => agent) });
  agent = initializedAgent;
  return { agent: initializedAgent, mediatorDID };
};

export const createOrganizationWallet = async (): Promise<OrganizationWallet> => {
  const { agent, mediatorDID } = await createAgent(`eulalia-organization-wallet-${crypto.randomUUID()}`);
  try {
    await agent.start();
    const did = await agent.createPeerDID([createMediatorService(mediatorDID)], false);
    return { did: String(did), agent };
  } catch (caught) {
    await agent.stop().catch(() => undefined);
    throw caught;
  }
};

export const exportOrganizationWallet = async (wallet: OrganizationWallet, password: string): Promise<string> => {
  validatePassword(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveBackupKey(password, salt, PBKDF2_ITERATIONS);
  const jweKey = await deriveBackupJweKey(password, salt, PBKDF2_ITERATIONS);
  const jwe = await wallet.agent.backup.createJWE({ compress: true, key: jweKey });
  const encryptedJwe = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, textEncoder.encode(jwe));
  const backup: EncryptedBackup = {
    version: BACKUP_VERSION,
    type: BACKUP_TYPE,
    salt: toBase64(salt),
    iv: toBase64(iv),
    encryptedJwe: toBase64(encryptedJwe),
    iterations: PBKDF2_ITERATIONS,
  };
  return JSON.stringify(backup);
};

export const importOrganizationWallet = async (contents: string, password: string): Promise<OrganizationWallet> => {
  validatePassword(password);
  let backup: EncryptedBackup;
  try { backup = JSON.parse(contents) as EncryptedBackup; } catch { throw new Error("El respaldo no es JSON válido."); }
  if (backup.type !== BACKUP_TYPE || !backup.salt || !backup.iv || !backup.encryptedJwe) {
    throw new Error("El respaldo no pertenece a una wallet Identus válida.");
  }
  if (backup.version === 1) throw new Error(LEGACY_BACKUP_MESSAGE);
  if (backup.version !== BACKUP_VERSION || backup.iterations !== PBKDF2_ITERATIONS) {
    throw new Error("El respaldo usa una versión o configuración criptográfica no compatible.");
  }

  let agent: IdentusAgent | null = null;
  let stage = "preparar el respaldo";
  try {
    const salt = fromBase64(backup.salt);
    const key = await deriveBackupKey(password, salt, backup.iterations);
    const jweKey = await deriveBackupJweKey(password, salt, backup.iterations);
    let jwe: ArrayBuffer;
    stage = "descifrar la contraseña del respaldo";
    try {
      jwe = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromBase64(backup.iv) },
        key,
        fromBase64(backup.encryptedJwe),
      );
    } catch {
      throw new Error("La contraseña es incorrecta o el respaldo está dañado.");
    }
    stage = "crear la wallet de destino";
    const created = await createAgent(`eulalia-organization-wallet-${crypto.randomUUID()}`);
    agent = created.agent;
    stage = "descifrar el JWE del SDK Identus";
    await agent.backup.restore(textDecoder.decode(jwe), { key: jweKey, compress: true });
    stage = "validar el DID restaurado";
    const dids = await agent.pluto.getAllPeerDIDs();
    if (dids.length === 0) throw new Error("El respaldo no contiene un DID de organización.");
     stage = "resolver el DID restaurado";
     let restoredDid: typeof dids[number]["did"] | undefined;
     let restoredDocument: Awaited<ReturnType<typeof agent.castor.resolveDID>> | undefined;
     for (const didEntry of dids) {
       if (String(didEntry.did) === created.mediatorDID) continue;
       const candidateDocument = await agent.castor.resolveDID(didEntry.did);
       const candidateServices = candidateDocument.services.filter((service) =>
         isUsableDIDCommEndpoint(service.serviceEndpoint),
       );
       if (candidateServices.length > 0) {
         restoredDid = didEntry.did;
         restoredDocument = candidateDocument;
         break;
       }
     }
     if (!restoredDid || !restoredDocument) {
       throw new Error("El respaldo no contiene un DID de organización distinto del DID del mediador con un servicio DIDComm utilizable.");
     }
     stage = "validar el enrutamiento del DID restaurado";
     // Backups produced by different SDK versions can deserialize the service
     // type without making `isDIDCommMessaging` true, even though the endpoint
     // is still a valid DIDComm endpoint. Validate the endpoint itself here;
     // routing/accept metadata is checked below and mismatches are reported as
     // warnings rather than rejecting an otherwise restorable wallet.
     const usableDidCommServices = restoredDocument.services.filter((service) =>
       isUsableDIDCommEndpoint(service.serviceEndpoint),
     );
    if (usableDidCommServices.length === 0) {
      throw new Error("El DID restaurado no contiene un servicio DIDComm utilizable.");
    }

    const currentMediatorRoutingKey = normalizeRoutingKey(`${created.mediatorDID}#key-1`);
    const hasCurrentMediatorRouting = usableDidCommServices.some((service) => {
      const endpoint = getEndpointDetails(service.serviceEndpoint);
      return endpoint?.routingKeys.some((routingKey) => normalizeRoutingKey(routingKey) === currentMediatorRoutingKey);
    });
    const hasDIDCommV2 = usableDidCommServices.some((service) => {
      const endpoint = getEndpointDetails(service.serviceEndpoint);
      return endpoint !== null
        && (endpoint.accept.length === 0 || endpoint.accept.some((accept) => accept.toLowerCase() === "didcomm/v2"));
    });
    if (!hasCurrentMediatorRouting || !hasDIDCommV2) {
      logger.warn("El DID restaurado tiene un servicio DIDComm utilizable, pero su representación de accept o routing key difiere de la sesión actual. Se continúa con el DID restaurado.");
    }
    const did = restoredDid;
    stage = "iniciar la wallet restaurada";
    await agent.start();
    return { did: String(did), agent };
  } catch (caught) {
    if (agent) await agent.stop().catch(() => undefined);
    const detail = caught instanceof Error ? caught.message : "No se pudo validar el contenido.";
    throw new Error(`No se pudo restaurar el respaldo al intentar ${stage}. ${detail}`);
  }
};

export const parseAndAcceptInvitation = async (wallet: OrganizationWallet, value: string) => {
  logger.info("SSI wallet: iniciando aceptación de invitación", {
    invitationLength: value.trim().length,
    walletDid: wallet.did,
  });
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("La invitación debe ser una URL OOB válida.");
  }

  if (!((url.protocol === "http:" || url.protocol === "https:") && url.searchParams.get("_oob"))) {
    throw new Error("La invitación debe ser una URL OOB válida.");
  }

  const invitation = await wallet.agent.parseOOBInvitation(url);
  logger.info("SSI wallet: invitación OOB parseada", {
    invitationHost: url.host,
    invitationHasOob: Boolean(url.searchParams.get("_oob")),
  });
  await wallet.agent.acceptInvitation(invitation, "eulalia-organization-cne");
  logger.info("SSI wallet: solicitud de conexión enviada");
  return invitation;
};

export const startWalletMessageListener = (wallet: OrganizationWallet, onCredential: (credential: unknown) => void) => {
  const listener = async (messages: MessageEventArg) => {
    for (const message of messages) {
      try {
        logger.info("Mensaje DIDComm recibido", { piuri: message.piuri });
        // Connection messages are already handled by the SDK before the MESSAGE
        // event is emitted. Calling agent.handle() here is invalid for the
        // connection protocol and produces "Protocol handler not found".
        const isCredentialOffer = message.piuri === OfferCredential.type
          || message.piuri === "https://didcomm.org/issue-credential/2.0/offer-credential";
        const isIssuedCredential = message.piuri === IssueCredential.type
          || message.piuri === "https://didcomm.org/issue-credential/2.0/issue-credential";
        if (isCredentialOffer) {
          logger.info("SSI wallet: oferta de credencial recibida", { piuri: message.piuri });
          const offer = OfferCredential.fromMessage(message as Parameters<typeof OfferCredential.fromMessage>[0]);
          const request = await wallet.agent.prepareRequestCredentialWithIssuer(offer);
          await wallet.agent.send(request.makeMessage());
          logger.info("SSI wallet: solicitud de credencial enviada");
        } else if (isIssuedCredential) {
          logger.info("SSI wallet: credencial emitida recibida", { piuri: message.piuri });
          const credential = await wallet.agent.processIssuedCredentialMessage(IssueCredential.fromMessage(message as Parameters<typeof IssueCredential.fromMessage>[0]));
          onCredential(credential);
          logger.info("SSI wallet: credencial procesada correctamente");
        }
      } catch (caught) {
        logger.warn("SSI wallet: error procesando mensaje DIDComm entrante", {
          error: caught instanceof Error ? caught.message : String(caught),
        });
      }
    }
  };
  wallet.agent.events.addListener(ListenerKey.MESSAGE, listener);
  return () => wallet.agent.events.removeListener(ListenerKey.MESSAGE, listener);
};

export const startWalletMessagePolling = async (wallet: OrganizationWallet) => {
  logger.info("Iniciando polling DIDComm de la wallet", {
    walletDid: wallet.did,
    mediatorDid: wallet.agent.currentMediatorDID ? String(wallet.agent.currentMediatorDID) : null,
  });
  wallet.agent.stopFetchingMessages();
  const poll = async () => {
    const state = walletPollingStates.get(wallet.agent);
    if (!state || state.busy) return;
    const connection = wallet.agent.connections.mediator;
    if (!connection) return;

    state.busy = true;
    try {
      const mediator = connection.asMediator();
      const pickup = new PickupRequest({ limit: 10 }, mediator.hostDID, mediator.mediatorDID);
      const delivery = await wallet.agent.mercury.sendMessageParseMessage(pickup.makeMessage());
      if (!delivery || delivery.attachments.length === 0) return;

      logger.info("SSI wallet: mensajes recibidos del mediador", {
        attachmentCount: delivery.attachments.length,
      });

      const decoded = await Promise.all(delivery.attachments.map(async (attachment, index) => {
        try {
          const message = await wallet.agent.mercury.unpackMessage(JSON.stringify(attachment.payload));
          logger.info("Adjunto DIDComm procesable", { index, piuri: message.piuri });
          return { attachment, message };
        } catch (caught) {
          logger.warn("Se omite un adjunto DIDComm antiguo o incompatible", {
            index,
            error: caught instanceof Error ? caught.message : String(caught),
          });
          return null;
        }
      }));
      const processable = decoded.filter((item): item is NonNullable<typeof item> => item !== null);
      if (processable.length > 0) {
        await wallet.agent.pluto.storeMessages(processable.map(({ message }) => message));
        wallet.agent.events.emit(ListenerKey.MESSAGE, processable.map(({ message }) => message));
      }

      const received = new PickupReceived(
        // A message that cannot be decrypted by this restored wallet is stale
        // for the current wallet. Acknowledge it so it cannot block newer offers.
        { message_id_list: delivery.attachments.map((attachment) => attachment.id) },
        mediator.hostDID,
        mediator.mediatorDID,
      );
      await wallet.agent.mercury.sendMessageParseMessage(received.makeMessage());
    } catch (caught) {
      logger.warn("SSI wallet: error consultando la cola DIDComm", {
        error: caught instanceof Error ? caught.message : String(caught),
      });
    } finally {
      state.busy = false;
    }
  };

  const previous = walletPollingStates.get(wallet.agent);
  if (previous) window.clearInterval(previous.timer);
  const state = { timer: 0, busy: false };
  state.timer = window.setInterval(() => { void poll(); }, 5_000);
  walletPollingStates.set(wallet.agent, state);
  await poll();
};

export const waitForWalletConnection = (
  wallet: OrganizationWallet,
  isEstablished: () => Promise<boolean>,
  timeoutMs = 60_000,
  signal?: AbortSignal,
) =>
  new Promise<boolean>((resolve) => {
    let settled = false;
    const timer: { id?: number } = {};
    const poller: { id?: number } = {};

    const finish = (connected: boolean) => {
      if (settled) return;
      settled = true;
      if (timer.id !== undefined) window.clearTimeout(timer.id);
      if (poller.id !== undefined) window.clearInterval(poller.id);
      wallet.agent.events.removeListener(ListenerKey.CONNECTION, onConnection);
      signal?.removeEventListener("abort", onAbort);
      resolve(connected);
    };

    const verify = async () => {
      try {
        if (await isEstablished()) finish(true);
      } catch (caught) {
        logger.warn("No se pudo verificar el estado remoto de la conexión DIDComm", caught);
      }
    };
    const onConnection = () => { void verify(); };
    const onAbort = () => finish(false);

    wallet.agent.events.addListener(ListenerKey.CONNECTION, onConnection);
    signal?.addEventListener("abort", onAbort, { once: true });
    poller.id = window.setInterval(() => { void verify(); }, 2_000);
    void verify();
    timer.id = window.setTimeout(() => finish(false), timeoutMs);
  });

export const stopWalletMessagePolling = (wallet: OrganizationWallet) => {
  wallet.agent.stopFetchingMessages();
  const state = walletPollingStates.get(wallet.agent);
  if (state) {
    window.clearInterval(state.timer);
    walletPollingStates.delete(wallet.agent);
  }
};

export const downloadWalletBackup = (contents: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "eulalia-identus-organization-wallet.backup.json";
  link.click();
  URL.revokeObjectURL(url);
};

export const validateWalletDid = (did: string) =>
  typeof did === "string" && did.length <= 4096 && /^did:(peer|prism):[^\s]+$/.test(did);
