// src/pages/admin/HomePage.tsx

import { useEffect, useState } from "react";
import { fetchParametros, updateParametro } from "../../services/configurationService";
import type { ParametroSistema } from "../../types/Configuration";
import { Globe, Code, ShieldCheck } from "lucide-react";

export function AdminHomePage() {
  const [parametros, setParametros] = useState<ParametroSistema[]>([]);
  const [valores, setValores] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState("configuracion_general");

  useEffect(() => {
    const obtenerParametros = async () => {
      const data = await fetchParametros();
      setParametros(data);
      const valoresIniciales: { [key: string]: string } = {};
      data.forEach((param: ParametroSistema) => {
        valoresIniciales[param.parametroId] = param.valor;
      });
      setValores(valoresIniciales);
    };
    obtenerParametros();
  }, []);

  const handleUpdate = async (clave: string) => {
    try {
      const nuevoValor = valores[clave];
      await updateParametro(clave, nuevoValor);
      alert("Parámetro actualizado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el parámetro.");
    }
  };

  const renderInput = (param: ParametroSistema) => {
    const commonProps = {
      className: "border border-gray-300 rounded px-2 py-1 w-full text-sm",
      value: valores[param.parametroId] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValores({ ...valores, [param.parametroId]: e.target.value }),
    };

    switch (param.tipo) {
      case "boolean":
        return (
          <select
            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
            value={valores[param.parametroId] || "false"}
            onChange={(e) =>
              setValores({ ...valores, [param.parametroId]: e.target.value })
            }
          >
            <option value="true">Verdadero</option>
            <option value="false">Falso</option>
          </select>
        );
      default:
        return <input type={param.tipo === "number" ? "number" : "text"} {...commonProps} />;
    }
  };

  const tabs = [
    { key: "configuracion_general", label: "CONFIGURACION GENERAL", icon: <Globe size={16} /> },
    { key: "seguridad", label: "SEGURIDAD", icon: <ShieldCheck size={16} /> },
    { key: "parametros_sistema", label: "PARAMETROS SISTEMA", icon: <Code size={16} /> },
    { key: "tema_visual", label: "TEMA VISUAL" },
    { key: "afiliacion", label: "AFILIACION" },
    { key: "ssi", label: "SSI" },
    { key: "comunicacion", label: "COMUNICACION" },
  ];

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-blue-800 text-white shadow"
              : "bg-blue-100 text-gray-800 hover:bg-blue-200"
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>

    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Parámetro</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {parametros
            .filter((param) => param.seccion === activeTab)
            .map((param) => (
              <tr key={param.parametroId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{param.parametroId}</td>
                <td className="px-4 py-2">{renderInput(param)}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{param.tipo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{param.descripcion}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleUpdate(param.parametroId)}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-3 py-1.5 rounded-md"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {parametros.filter((p) => p.seccion === activeTab).length === 0 && (
        <p className="p-4 text-sm text-gray-500">No hay parámetros en esta sección.</p>
      )}
    </div>
  </div>
);

}

export default AdminHomePage;