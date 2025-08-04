import { useEffect, useState, useContext } from "react";
import { fetchAfiliadosDePartido } from "@/services/partidoService";
import { AuthContext } from "@/context/AuthContext";
import type { Afiliado } from "@/types/Afiiado";

export const useAfiliadosPartido = () => {
  const { organizacionId } = useContext(AuthContext);
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarAfiliados = async () => {
      if (!organizacionId) return;
      try {
        setLoading(true);
        const data = await fetchAfiliadosDePartido(organizacionId);
        setAfiliados(data);
      } catch (error) {
        console.error("❌ Error al cargar afiliados del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAfiliados();
  }, [organizacionId]);

  return { afiliados, loading };
};
