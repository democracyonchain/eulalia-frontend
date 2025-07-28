import axiosInstance from './axiosInstance';
import type { ParametroSistema } from "../types/Configuration";

export const fetchParametros = async (): Promise<ParametroSistema[]> => {
  const res = await axiosInstance.get('/Parametrosistema');
  console.log("🔍 Datos recibidos:", res.data);

  if (!Array.isArray(res.data)) {
    console.error("❌ Respuesta inesperada:", res.data);
    return [];
  }

  return res.data;
};

export const updateParametro = async (clave: string, nuevoValor: string) => {
  return axiosInstance.put(`/Parametrosistema/${clave}`, { valor: nuevoValor });
};
