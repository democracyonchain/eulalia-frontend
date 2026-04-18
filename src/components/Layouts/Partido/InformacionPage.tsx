import { useInformacionPartidoForm } from "@/hooks/useInformacionPartidoForm";

function InformacionPage() {
  const { form, loading } = useInformacionPartidoForm();

  if (loading) {
    return <p className="text-gray-600 px-6 py-4">Cargando información del partido...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Partido</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Organización</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              readOnly
              className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección / Ubicación</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              readOnly
              className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Siglas</label>
            <input
              type="text"
              name="siglas"
              placeholder="No definido"
              value={form.siglas}
              readOnly
              className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-slate-400 italic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-slate-400 italic"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-4">Información de Registro</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold uppercase">Tipo</p>
              <p className="text-sm text-slate-800 font-medium">Organización Política</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold uppercase">Estado en Sistema</p>
              <p className="text-sm text-green-700 font-bold">Activo / Validado</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InformacionPage;
