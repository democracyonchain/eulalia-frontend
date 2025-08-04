import axiosInstance from "./axiosInstance";
import type { SolicitudOrganizacionForm } from "@/types/SolicitudOrganizacion";

export const enviarSolicitudOrganizacion = async (form: SolicitudOrganizacionForm) => {
  return await axiosInstance.post("/SolicitudOrganizacion/crear", {
    nombre: form.nombre,
    tipo_organizacion: form.tipo_organizacion,
    codigo_provincia: parseInt(form.codigo_provincia),
    codigo_canton: form.codigo_canton,
    codigo_parroquia: form.codigo_parroquia,
    responsable_cedula: form.responsable_cedula,
    responsable_nombre: form.responsable_nombre,
    responsable_apellido: form.responsable_apellido,
    responsable_fechaNacimiento: form.responsable_fechaNacimiento,
    responsable_direccion: form.responsable_direccion,
    responsable_telefono: form.responsable_telefono,
    responsable_email: form.responsable_email,
    observaciones: form.observaciones
  });
};
export const fetchSolicitudes = async () => {
  const response = await axiosInstance.get("/SolicitudOrganizacion/listar");
  return response.data;
};
export const actualizarEstadoSolicitud = async (solicitudId: number, estado: string) => {
  return await axiosInstance.put(`/SolicitudOrganizacion/${solicitudId}/estado`, { estado });
};  