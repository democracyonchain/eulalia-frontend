import axiosInstance from "./axiosInstance";
import type { Usuario } from "@/types/Usuario";

export const fetchAnalistas = async (): Promise<Usuario[]> => {
  const res = await axiosInstance.get("/usuario");

  if (!Array.isArray(res.data)) {
    console.error("❌ La respuesta del backend no es un array:", res.data);
    return [];
  }

  // Filtra los usuarios con rol "Analista" (rol_Id = 5)
  return res.data.filter((u: Usuario) => u.rol_Id === 5);
};
