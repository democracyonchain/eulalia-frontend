// src/services/partidoService.ts
import axiosInstance from "./axiosInstance";

// === Información del partido ===
export const fetchInformacionPartido = async (organizacionId: number) => {
  const response = await axiosInstance.get(`/Organizacion/${organizacionId}`);
  return response.data;
};

export const actualizarInformacionPartido = async (datos: any) => {
  return await axiosInstance.put("/Partido/actualizar", datos);
};

// === Afiliados ===
export const fetchAfiliadosPartido = async () => {
  const response = await axiosInstance.get("/Afiliacion/afiliados-partido");
  return response.data;
};

export const eliminarAfiliado = async (afiliadoId: number) => {
  return await axiosInstance.delete(`/Afiliacion/${afiliadoId}`);
};

export const fetchAfiliadosDePartido = async (organizacionId: number) => {
  const response = await axiosInstance.get(`/Afiliacion/afiliados/${organizacionId}`);
  return response.data;
};

export const anularAfiliacion = async (afiliacionId: number) => {
  return axiosInstance.put(`/Afiliacion/${afiliacionId}/anular`);
};



// === Directiva ===
export const fetchDirectivaPartido = async () => {
  const response = await axiosInstance.get("/Partido/directiva");
  return response.data;
};

export const agregarMiembroDirectiva = async (miembro: any) => {
  return await axiosInstance.post("/Partido/directiva", miembro);
};

export const eliminarMiembroDirectiva = async (id: number) => {
  return await axiosInstance.delete(`/Partido/directiva/${id}`);
};

// === Documentos ===
export const fetchDocumentosPartido = async () => {
  const response = await axiosInstance.get("/Partido/documentos");
  return response.data;
};

export const subirDocumentoPartido = async (formData: FormData) => {
  return await axiosInstance.post("/Partido/documentos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const eliminarDocumentoPartido = async (documentoId: number) => {
  return await axiosInstance.delete(`/Partido/documentos/${documentoId}`);
};

// === Reportes ===
export const fetchReporteAfiliados = async () => {
  const response = await axiosInstance.get("/Partido/reportes/afiliados");
  return response.data;
};

export const fetchReporteGeneral = async () => {
  const response = await axiosInstance.get("/Partido/reportes/general");
  return response.data;
};
