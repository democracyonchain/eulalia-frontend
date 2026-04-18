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

export const fetchOrganizaciones = async (): Promise<OrganizacionDto[]> => {
    const response = await axiosInstance.get("/Organizacion");
    return response.data;
};

export const fetchOrganizacionDetail = async (id: number): Promise<OrganizacionDto> => {
    const response = await axiosInstance.get(`/Organizacion/${id}`);
    return response.data;
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
