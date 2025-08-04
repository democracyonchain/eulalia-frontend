import { useAfiliadosPartido } from "@/hooks/useAfiliadosPartido";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { anularAfiliacion } from "@/services/partidoService";
import type { Afiliado } from '../../../types/Afiiado';


function AfiliadosPage() {
  const { afiliados, loading } = useAfiliadosPartido();
  const [search, setSearch] = useState("");
  const [localAfiliados, setLocalAfiliados] = useState(afiliados);

  useEffect(() => {
    setLocalAfiliados(afiliados);
  }, [afiliados]);

  const filtered = localAfiliados.filter((a: any) =>
    `${a.cedula} ${a.estado}`.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Afiliados");
    XLSX.writeFile(workbook, "afiliados_partido.xlsx");
    toast.success("Archivo exportado exitosamente");
  };

  const handleAnular = async (id: number) => {
  try {
    await anularAfiliacion(id);
    setLocalAfiliados((prev: Afiliado[]) =>
      prev.map((a) =>
        a.afiliacion_Id === id ? { ...a, estado: "Anulado" } : a
      )
    );
    toast.success("Afiliación anulada correctamente");
  } catch (error) {
    toast.error("Error al anular afiliación");
  }
};

  const handleDetalle = (id: number) => {
    toast.info(`Mostrando detalles de la afiliación (ID ${id})`);
    // Aquí podrías abrir un modal o redirigir a una vista de detalle
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Afiliados</h2>
      <p className="mt-2 text-gray-600 mb-4">
        Consulta y gestiona a los ciudadanos afiliados a tu partido.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por cédula o estado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm w-full md:w-1/3"
        />
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Download size={16} /> Exportar
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando afiliados...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No hay afiliados registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cédula</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Apellido</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha de Afiliación</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a: any, index: number) => (
                <tr key={a.afiliacion_Id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{a.cedula}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{a.nombre}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{a.apellido}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(a.fechaAfiliacion).toLocaleDateString("es-EC", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{a.estado}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 space-x-2">
                    <button
                      onClick={() => handleDetalle(a.afiliacion_Id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleAnular(a.afiliacion_Id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Anular
                    </button>
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

export default AfiliadosPage;
