import { useState } from "react";

export const useSolicitudOrganizacionForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    tipo_organizacion: "",
    codigo_provincia: "",
    codigo_canton: "",
    codigo_parroquia: "",
    responsable_cedula: "",
    responsable_nombre: "",
    responsable_apellido: "",
    responsable_fechaNacimiento: "",
    responsable_direccion: "",
    responsable_telefono: "",
    observaciones: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return { form, setForm, handleChange };
};
