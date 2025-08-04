import React, { useState } from "react";
import { useSolicitudOrganizacionForm } from "@/hooks/useSolicitudOrganizacionForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { enviarSolicitudOrganizacion } from "@/services/solicitudService";

const SolicitudOrganizacionPage = () => {
  const { form, setForm, handleChange, provincias } = useSolicitudOrganizacionForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.tipo_organizacion ||
      !form.codigo_provincia ||
      !form.responsable_cedula ||
      !form.responsable_nombre ||
      !form.responsable_apellido ||
      !form.responsable_email
    ) {
      toast.warning("⚠️ Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      await enviarSolicitudOrganizacion(form);
      toast.success("✅ Solicitud enviada correctamente");

      setForm({
        nombre: "",
        tipo_organizacion: "",
        codigo_provincia: "",
        codigo_canton: 0,
        codigo_parroquia: 0,
        responsable_cedula: "",
        responsable_nombre: "",
        responsable_apellido: "",
        responsable_fechaNacimiento: "",
        responsable_direccion: "",
        responsable_telefono: "",
        responsable_email: "",
        observaciones: ""
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.message || "❌ Error durante el registro. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

 return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-10 space-y-8">

      <h1 className="text-3xl font-bold text-center text-gray-800">
        🗳️ Solicitud de Organización Política
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10" style={{ padding: '2rem' }}>
        {/* 🏛️ Datos de la Organización */}
        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-2">
            🏛️ Datos de la Organización
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Movimiento Esperanza"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo_organizacion"
                value={form.tipo_organizacion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              >
                <option value="">Seleccione</option>
                <option value="Partido">Partido</option>
                <option value="Movimiento">Movimiento</option>
                <option value="Lista Independiente">Lista Independiente</option>
              </select>
            </div>

            {/* Provincia */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
              <select
                name="codigo_provincia"
                value={form.codigo_provincia}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              >
                <option value="">Seleccione una provincia</option>
                {provincias.map((prov) => (
                  <option key={prov.codigo_Provincia} value={prov.codigo_Provincia}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* 👤 Datos del Representante */}
        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-2">
            👤 Datos del Representante
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cédula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
              <input
                type="text"
                name="responsable_cedula"
                placeholder="Ej. 0102030405"
                value={form.responsable_cedula}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                name="responsable_fechaNacimiento"
                value={form.responsable_fechaNacimiento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <input
                type="text"
                name="responsable_nombre"
                value={form.responsable_nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <input
                type="text"
                name="responsable_apellido"
                value={form.responsable_apellido}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                name="responsable_email"
                value={form.responsable_email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="responsable_direccion"
                value={form.responsable_direccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>

            {/* Teléfono */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="responsable_telefono"
                value={form.responsable_telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
              />
            </div>
          </div>
        </fieldset>

        {/* 📝 Observaciones */}
        <fieldset>
          <legend className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-2">
            📝 Observaciones
          </legend>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm text-sm"
            placeholder="Observaciones adicionales..."
            rows={4}
          />
        </fieldset>

        {/* Botones */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white text-base px-6 py-2 rounded-md"
          >
            ← Atrás
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 hover:bg-blue-800 text-white text-base px-6 py-2 rounded-md flex items-center justify-center gap-2"
          >
            📤 Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default SolicitudOrganizacionPage;
