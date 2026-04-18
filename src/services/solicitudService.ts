import logger from "../utils/logger";
import axiosInstance from "./axiosInstance";
import type { SolicitudOrganizacionForm } from "@/types/SolicitudOrganizacion";

export const enviarSolicitudOrganizacion = async (form: SolicitudOrganizacionForm) => {
  const payload = {
    nombre: form.nombre,
    tipo_Organizacion: form.tipo_organizacion,
    codigo_Provincia: parseInt(form.codigo_provincia) || 0,
    codigo_Canton: form.codigo_canton || 0,
    codigo_Parroquia: form.codigo_parroquia || 0,
    responsable_Cedula: form.responsable_cedula,
    responsable_Nombre: form.responsable_nombre,
    responsable_Apellido: form.responsable_apellido,
    responsable_FechaNacimiento: form.responsable_fechaNacimiento
      ? new Date(form.responsable_fechaNacimiento).toISOString()
      : "",
    responsable_Direccion: form.responsable_direccion,
    responsable_Telefono: form.responsable_telefono,
    responsable_Email: form.responsable_email,
    observaciones: form.observaciones
  };

  // Imprimir en consola los valores que se envían en el post (solo en dev)
  logger.log("📤 Enviando payload a la API:", payload);

  return await axiosInstance.post("/SolicitudOrganizacion/crear", payload);
};
export const fetchSolicitudes = async () => {
  const response = await axiosInstance.get("/SolicitudOrganizacion/listar");
  return response.data;
};
export const actualizarEstadoSolicitud = async (solicitudId: number, estado: string) => {
  return await axiosInstance.put(`/SolicitudOrganizacion/${solicitudId}/estado`, { estado });
};  