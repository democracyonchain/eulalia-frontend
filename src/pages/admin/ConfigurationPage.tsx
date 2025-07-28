import React, { useState, useEffect } from "react";
import type { ParametroSistema } from "../../types/Configuration";
import { fetchParametros } from "../../services/configurationService";
import ConfigurationTable from "../../components/Configuration/ConfigurationTable";

const AdminHomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("parametros");
  const [parametros, setParametros] = useState<ParametroSistema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarParametros = async () => {
      try {
        const data = await fetchParametros();
        setParametros(data);
      } catch (error) {
        console.error("❌ Error al cargar parámetros:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarParametros();
  }, []);

  const tabs = [
    { id: "parametros", label: "⚙️ Parámetros del Sistema" },
    { id: "seguridad", label: "🔒 Seguridad" },
    { id: "tema", label: "🎨 Tema Visual" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Configuración del Sistema</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 mr-2 font-semibold border-b-4 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="bg-white shadow p-6 rounded-md">
        {loading ? (
          <p className="text-gray-500">Cargando configuración...</p>
        ) : (
          <>
            {activeTab === "parametros" && (
              <ConfigurationTable
                parametros={parametros}
                setParametros={setParametros}
              />
            )}
            {activeTab === "seguridad" && <p>Opciones de seguridad (próximamente).</p>}
            {activeTab === "tema" && <p>Opciones de personalización (próximamente).</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
