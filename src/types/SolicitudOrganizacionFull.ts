export interface SolicitudOrganizacionFull {
  solicitud_Id: number;
  estado: string;
  observaciones?: string;
  fechaSolicitud: string;
  fechaRevision?: string;
  usuarioRevisor?: string;
  organizacion: {
    organizacion_Id: number;
    nombre: string;
    tipo_Organizacion: string;
    codigo_Provincia: number;
    codigo_Canton: number;
    codigo_Parroquia: number;
    estado_Validacion: string;
    fecha_Creacion: string;
    responsable_Cedula: string;
    responsable: {
      cedula: string;
      nombre: string;
      apellido: string;
      telefono: string;
      direccion: string;
      fecha_Nacimiento: string;
    } | null;
  } | null;
}
