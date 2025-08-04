import { useState, useEffect } from "react";
import type { SolicitudOrganizacionForm } from "@/types/SolicitudOrganizacion";
import type { Provincia } from "@/types/Jurisdiccion";
import { fetchProvincias } from "@/services/jurisdiccionService";

export const useSolicitudOrganizacionForm = () => {
  const [form, setForm] = useState<SolicitudOrganizacionForm>({
    nombre: "",
    tipo_organizacion: "",
    codigo_provincia: "",
    codigo_canton: 0,
    codigo_parroquia: 0,
    responsable_cedula: "",
    responsable_nombre: "",
    responsable_apellido: "",
    responsable_fechaNacimiento: "",
    responsable_direccion: "",
    responsable_telefono: "",
    responsable_email: "",
    observaciones: ""
  });

  const [provincias, setProvincias] = useState<Provincia[]>([]);
useEffect(() => {
    const cargarProvincias = async () => {
      try {
        const data = await fetchProvincias(); 
        setProvincias(data);
      } catch (error) {
        console.error("❌ Error al cargar provincias:", error);
      }
    };

    cargarProvincias();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return { form, setForm, handleChange, provincias };
};
