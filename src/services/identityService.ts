import axiosInstance from "./axiosInstance";

export interface IdentityProfile {
  cedula: string;
  nombre: string;
  apellido: string;
  fecha_Nacimiento: string;
  direccion: string;
  telefono: string;
  did?: string;
  estadoAfiliacion?: string;
  organizacion?: string;
}

export const fetchIdentityProfile = async (cedula: string): Promise<IdentityProfile> => {
  const response = await axiosInstance.get(`/Ciudadano/${cedula}`);
  return response.data;
};

export const fetchWalletStatus = async (cedula: string) => {
  const response = await axiosInstance.get(`/SSI/status/${cedula}`);
  return response.data;
};

export const createIdentity = async (data: any) => {
  return await axiosInstance.post("/Ciudadano", data);
}

export const requestSSIInvitation = async (cedula: string) => {
  const response = await axiosInstance.post(`/SSI/invitation/${cedula}`);
  return response.data;
};
