import { useState, useEffect, useContext } from "react";
import { fetchInformacionPartido } from "@/services/partidoService";
import { AuthContext } from "@/context/AuthContext";

export interface InformacionPartidoForm {
  nombre: string;
  siglas: string;
  fecha_fundacion: string;
  direccion: string;
  telefono: string;
  email: string;
}

export const useInformacionPartidoForm = () => {
  const [form, setForm] = useState<InformacionPartidoForm>({
    nombre: "",
    siglas: "",
    fecha_fundacion: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const { organizacionId } = useContext(AuthContext);

  useEffect(() => {
    const cargarInformacion = async () => {
      try {
        if (!organizacionId) return;
        setLoading(true);
        const data = await fetchInformacionPartido(organizacionId);
        setForm(data);
      } catch (error) {
        console.error("❌ Error al cargar la información del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarInformacion();
  }, [organizacionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    form,
    setForm,
    handleChange,
    loading,
  };
};
