import React from "react";
import { useSolicitudOrganizacionForm } from "@/hooks/useSolicitudOrganizacionForm";

const SolicitudOrganizacionPage = () => {
  const { form, handleChange } = useSolicitudOrganizacionForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/solicitudorganizacion/crear", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("❌ Error al enviar la solicitud.");
    }
  };

  return (
  <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
    <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
      Solicitud de Organización Política
    </h1>

    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Datos de la Organización */}
      <fieldset className="border p-6 rounded-md">
        <legend className="text-xl font-semibold text-gray-700 mb-4">
          🏛️ Datos de la Organización
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la Organización:</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Ej. Movimiento Esperanza" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Organización:</label>
            <select name="tipo_organizacion" value={form.tipo_organizacion} onChange={handleChange}
              className="w-full border rounded px-4 py-2">
              <option value="">Seleccione</option>
              <option value="Partido">Partido</option>
              <option value="Movimiento">Movimiento</option>
              <option value="Lista Independiente">Lista Independiente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Provincia:</label>
            <input type="text" name="codigo_provincia" value={form.codigo_provincia} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Ej. 01" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cantón:</label>
            <input type="text" name="codigo_canton" value={form.codigo_canton} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Ej. 02" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parroquia:</label>
            <input type="text" name="codigo_parroquia" value={form.codigo_parroquia} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Ej. 03" />
          </div>
        </div>
      </fieldset>

      {/* Datos del Representante */}
      <fieldset className="border p-6 rounded-md">
        <legend className="text-xl font-semibold text-gray-700 mb-4">
          👤 Datos del Representante
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Cédula:</label>
            <input type="text" name="responsable_cedula" value={form.responsable_cedula} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Ej. 0102030405" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fecha de Nacimiento:</label>
            <input type="date" name="responsable_fechaNacimiento" value={form.responsable_fechaNacimiento} onChange={handleChange}
              className="w-full border rounded px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nombre:</label>
            <input type="text" name="responsable_nombre" value={form.responsable_nombre} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Nombres" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Apellido:</label>
            <input type="text" name="responsable_apellido" value={form.responsable_apellido} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Apellidos" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dirección:</label>
            <input type="text" name="responsable_direccion" value={form.responsable_direccion} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="Dirección completa" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono:</label>
            <input type="text" name="responsable_telefono" value={form.responsable_telefono} onChange={handleChange}
              className="w-full border rounded px-4 py-2" placeholder="09xxxxxxxx" />
          </div>
        </div>
      </fieldset>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium mb-2">Observaciones adicionales:</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
          className="w-full border rounded px-4 py-2" rows={4} placeholder="Escribe aquí detalles relevantes..." />
      </div>

      {/* Botón de envío */}
      <div className="text-center">
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-lg">
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>
);



};

export default SolicitudOrganizacionPage;
