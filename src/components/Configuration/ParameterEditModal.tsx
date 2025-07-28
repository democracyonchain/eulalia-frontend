import React, { useState } from "react";
import type { ParametroSistema } from "../../types/Configuration";

interface Props {
  parametro: ParametroSistema;
  onClose: () => void;
  onSave: (parametroActualizado: ParametroSistema) => void;
}

const ParameterEditModal: React.FC<Props> = ({ parametro, onClose, onSave }) => {
  const [valor, setValor] = useState(parametro.valor);

  const handleSubmit = () => {
    onSave({ ...parametro, valor });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Parámetro</h2>
        <p className="text-sm text-gray-600 mb-2">{parametro.descripcion}</p>

        <input
          type={parametro.tipo === "url" ? "url" : "text"}
          className="w-full border rounded-md p-2 mb-4"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterEditModal;
