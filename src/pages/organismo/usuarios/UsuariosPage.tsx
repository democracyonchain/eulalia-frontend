import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAnalistas } from "@/services/usuarioService";
import type { Usuario } from "@/types/Usuario";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const analistas = await fetchAnalistas();
        setUsuarios(analistas);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        toast.error("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra los usuarios analistas registrados.</p>
        </div>
        <button
          onClick={() => navigate("/organismo/usuarios/crear")}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusCircle size={18} /> Nuevo Analista
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-gray-500">No hay usuarios analistas registrados aún.</p>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100 text-sm font-medium text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Correo</th>
                <th className="px-6 py-3 text-left">Cédula</th>
                <th className="px-6 py-3 text-left">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {usuarios.map((u) => (
                <tr key={u.usuario_Id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{u.correo}</td>
                  <td className="px-6 py-3">{u.cedula_Ciudadano}</td>
                  <td className="px-6 py-3">
                    {new Date(u.fecha_Creacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
