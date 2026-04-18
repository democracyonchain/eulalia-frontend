import axiosInstance from "./axiosInstance";

export interface AfiliacionDto {
  afiliacionId: number;
  cedula: string;
  organizacionId: number;
  fechaAfiliacion: string;
  estado: string;
}

const normalizeAfiliacion = (raw: any): AfiliacionDto => ({
  afiliacionId: raw.afiliacionId ?? raw.afiliacion_Id,
  cedula: raw.cedula ?? raw.cedula_Ciudadano,
  organizacionId: raw.organizacionId ?? raw.organizacion_Id,
  fechaAfiliacion: raw.fechaAfiliacion ?? raw.fecha_Afiliacion,
  estado: raw.estado,
});

export const fetchAfiliaciones = async (): Promise<AfiliacionDto[]> => {
  const response = await axiosInstance.get("/Afiliacion");
  return (response.data as any[]).map(normalizeAfiliacion);
};

export const fetchAfiliacionDetail = async (id: number): Promise<AfiliacionDto> => {
  const response = await axiosInstance.get(`/Afiliacion/${id}`);
  return normalizeAfiliacion(response.data);
};

export const createAfiliacion = async (data: { cedula: string; organizacionId: number }) => {
  return await axiosInstance.post("/Afiliacion", {
    cedula: data.cedula,
    organizacionId: data.organizacionId,
    estado: "Activa",
  });
};

export const anularAfiliacion = async (id: number) => {
  return await axiosInstance.put(`/Afiliacion/${id}/anular`);
};
