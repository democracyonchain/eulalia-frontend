import axiosInstance from "./axiosInstance";

export interface OrganizacionDto {
    organizacionId: number;
    nombre: string;
    tipo: string;
    codigoProvincia: number;
    codigoCanton: number;
    codigoParroquia: number;
    responsableCedula: string;
    estado: string;
}

export interface OrganizacionIdentidadDto {
    organizacionId: number;
    nombre: string;
    estadoAprobacion: string;
    did: string | null;
    clientDid: string | null;
    holderConnectionId: string | null;
    estadoIdentidad: string | null;
    estadoCredencial: string | null;
    referenciaEmisor: string | null;
    referenciaOperacion: string | null;
    longFormDid: string | null;
    publishedDid: string | null;
    credentialRecordId: string | null;
    creadoEn: string | null;
    actualizadoEn: string | null;
    error: string | null;
}

export const fetchOrganizaciones = async (): Promise<OrganizacionDto[]> => {
    const response = await axiosInstance.get("/Organizacion");
    return response.data;
};

export const fetchOrganizacionDetail = async (id: number): Promise<OrganizacionDto> => {
    const response = await axiosInstance.get(`/Organizacion/${id}`);
    return response.data;
};

export const fetchOrganizacionIdentidad = async (): Promise<OrganizacionIdentidadDto> => {
    const response = await axiosInstance.get("/Organizacion/identidad");
    return response.data;
};

export const associateOrganizacionDid = async (did: string) => {
    const response = await axiosInstance.put("/Organizacion/identidad/did", { did });
    return response.data as { did: string; status: string };
};

export const associateOrganizacionHolderConnection = async (holderConnectionId: string) => {
    const response = await axiosInstance.put("/Organizacion/identidad/conexion", { holderConnectionId });
    return response.data as { holderConnectionId: string };
};

export const createOrganizacionHolderInvitation = async () => {
    const response = await axiosInstance.post("/Organizacion/identidad/invitacion");
    return response.data as { invitationUrl: string; invitationId: string };
};

export const recoverOrganizacionHolderConnection = async () => {
    const response = await axiosInstance.post("/Organizacion/identidad/conexion/recuperar");
    return response.data as {
        connected: boolean;
        invitationUrl?: string;
        invitationId?: string;
        holderConnectionId: string;
  };
};

export const fetchOrganizacionHolderConnectionStatus = async () => {
    const response = await axiosInstance.get("/Organizacion/identidad/conexion/estado");
    return response.data as { connected: boolean; holderConnectionId: string | null };
};

export const retryOrganizacionCredential = async () => {
    const response = await axiosInstance.post("/Organizacion/identidad/credencial/reintentar");
    return response.data as {
        status: string;
        credentialStatus: string;
        credentialRecordId: string;
        message: string;
    };
};

export const confirmOrganizacionCredentialReceipt = async () => {
    const response = await axiosInstance.post("/Organizacion/identidad/credencial/confirmar-recepcion");
    return response.data as { status: string; credentialStatus: string; message: string };
};

export const createOrganizacion = async (data: OrganizacionDto) => {
    return await axiosInstance.post("/Organizacion", data);
};

export const updateOrganizacion = async (id: number, data: OrganizacionDto) => {
    return await axiosInstance.put(`/Organizacion/${id}`, data);
};

export const deleteOrganizacion = async (id: number) => {
    return await axiosInstance.delete(`/Organizacion/${id}`);
};
