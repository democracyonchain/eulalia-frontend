import React, { useState } from 'react';
import type { ParametroSistema } from '../../types/Configuration';
import { updateParametro } from '../../services/configurationService';

interface Props {
  parametros: ParametroSistema[];
  setParametros: React.Dispatch<React.SetStateAction<ParametroSistema[]>>;
}

const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const isValidUrl = (value: string): boolean => {
  return /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value);
};

const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

const formatJson = (value: string): string => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const ConfigurationTable: React.FC<Props> = ({ parametros, setParametros }) => {
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const handleChange = (index: number, newValue: string | boolean) => {
    const updated = [...parametros];
    updated[index].valor = typeof newValue === 'boolean' ? (newValue ? 'true' : 'false') : newValue;
    setParametros(updated);
  };

  const handleFormatJson = (index: number) => {
    const updated = [...parametros];
    updated[index].valor = formatJson(updated[index].valor);
    setParametros(updated);
  };

  const handleSave = async (param: ParametroSistema) => {
    if (param.tipo === 'json' && !isValidJson(param.valor)) {
      alert(`❌ El JSON del parámetro "${param.parametroId}" es inválido.`);
      return;
    }
    if (param.tipo === 'url' && !isValidUrl(param.valor)) {
      alert(`❌ La URL del parámetro "${param.parametroId}" no es válida.`);
      return;
    }
    if (param.tipo === 'number' && !isValidNumber(param.valor)) {
      alert(`❌ El número del parámetro "${param.parametroId}" no es válido.`);
      return;
    }

    setSaving(param.parametroId);
    try {
      await updateParametro(param);
      alert(`✅ Parámetro "${param.parametroId}" actualizado.`);
    } catch (err) {
      console.error(err);
      alert(`❌ Error al guardar el parámetro "${param.parametroId}".`);
    } finally {
      setSaving(null);
    }
  };

  const filtered = parametros.filter(
    (p) =>
      p.parametroId.toLowerCase().includes(filter.toLowerCase()) &&
      (filterTipo === '' || p.tipo === filterTipo)
  );

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por clave..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        >
          <option value="">Todos los tipos</option>
          <option value="texto">Texto</option>
          <option value="boolean">Booleano</option>
          <option value="number">Número</option>
          <option value="url">URL</option>
          <option value="json">JSON</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase">
              <th className="p-3 text-left">Parámetro</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((param, idx) => {
              const isInvalid =
                (param.tipo === 'json' && !isValidJson(param.valor)) ||
                (param.tipo === 'url' && !isValidUrl(param.valor)) ||
                (param.tipo === 'number' && !isValidNumber(param.valor));

              return (
                <tr key={param.parametroId} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-mono">{param.parametroId}</td>

                  <td className="p-2">
                    {param.tipo === 'boolean' ? (
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={param.valor === 'true'}
                          onChange={(e) => handleChange(idx, e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">{param.valor === 'true' ? 'Sí' : 'No'}</span>
                      </label>
                    ) : param.tipo === 'json' ? (
                      <div>
                        <textarea
                          value={param.valor}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          rows={4}
                          className={`w-full px-2 py-1 text-xs font-mono rounded ${
                            isValidJson(param.valor)
                              ? 'border border-gray-300'
                              : 'border border-red-500'
                          }`}
                        />
                        {!isValidJson(param.valor) && (
                          <p className="text-red-600 text-xs mt-1">JSON inválido</p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFormatJson(idx)}
                          className="mt-1 text-xs text-blue-600 hover:underline"
                        >
                          Formatear JSON
                        </button>
                      </div>
                    ) : (
                      <input
                        type={param.tipo === 'number' ? 'number' : 'text'}
                        value={param.valor}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        className={`w-full px-2 py-1 border rounded ${
                          isInvalid ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    )}
                  </td>

                  <td className="p-2">{param.tipo}</td>
                  <td className="p-2">{param.descripcion || '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleSave(param)}
                      disabled={saving === param.parametroId}
                      className={`text-white px-3 py-1 rounded ${
                        saving === param.parametroId
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {saving === param.parametroId ? 'Guardando...' : 'Guardar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No se encontraron parámetros.</p>
        )}
      </div>
    </div>
  );
};

export default ConfigurationTable;
