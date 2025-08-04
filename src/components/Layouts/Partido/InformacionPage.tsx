import { useInformacionPartidoForm } from "@/hooks/useInformacionPartidoForm";

function InformacionPage() {
  const { form, handleChange, loading } = useInformacionPartidoForm();

  if (loading) {
    return <p className="text-gray-600 px-6 py-4">Cargando información del partido...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Partido</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Siglas</label>
          <input
            type="text"
            name="siglas"
            value={form.siglas}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Fundación</label>
          <input
            type="date"
            name="fecha_fundacion"
            value={form.fecha_fundacion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </form>
    </div>
  );
}

export default InformacionPage;
