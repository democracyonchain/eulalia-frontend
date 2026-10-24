import { useEffect, useState, useContext } from "react";
import { fetchAfiliaciones } from "@/services/afiliacionService";
import { AuthContext } from "@/context/AuthContext";
import type { AfiliacionDto } from "@/services/afiliacionService";

export const useAfiliadosPartido = () => {
  const { organizacionId } = useContext(AuthContext);
  const [afiliados, setAfiliados] = useState<AfiliacionDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarAfiliados = async () => {
      if (!organizacionId) return;
      try {
        setLoading(true);
        const data = await fetchAfiliaciones();
        const filtered = data.filter((a) => a.organizacionId === organizacionId);
        setAfiliados(filtered);
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
