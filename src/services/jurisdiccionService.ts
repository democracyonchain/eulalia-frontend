import axiosInstance from './axiosInstance';
import type { Provincia } from "../types/Jurisdiccion";

export const fetchProvincias = async (): Promise<Provincia[]> => {
  const res = await axiosInstance.get('/Provincia');
  if (!Array.isArray(res.data)) {
    console.error("❌ Respuesta inesperada:", res.data);
    return [];
  }

  return res.data;
};