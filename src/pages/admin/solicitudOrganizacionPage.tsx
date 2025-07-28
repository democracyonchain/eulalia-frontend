import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import FormTextarea from "../../components/FormTextarea";

function SolicitudOrganizacionPage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Solicitud de Registro de Organización Política
      </h1>
      <form className="space-y-6">

        <FormInput
          label="Nombre de la Organización"
          id="org-nombre"
          name="org-nombre"
          type="text"
          placeholder="Ej: Movimiento Esperanza"
          required
        />

        <FormSelect
          label="Tipo de Organización"
          id="tipo-org"
          name="tipo-org"
          options={[
            { label: "Seleccione", value: "" },
            { label: "Partido", value: "Partido" },
            { label: "Movimiento", value: "Movimiento" },
            { label: "Lista Independiente", value: "Lista Independiente" },
          ]}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput id="provincia" label="Provincia" name="provincia" placeholder="Ej: 01" />
          <FormInput id="canton" label="Cantón" name="canton" placeholder="Ej: 02" />
          <FormInput id="parroquia" label="Parroquia" name="parroquia" placeholder="Ej: 03" />
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          👤 Representante Legal
        </h2>

        <FormInput
          label="Cédula"
          id="cedula"
          name="cedula"
          placeholder="Ej: 0102030405"
          required
        />

        <FormInput
          label="Fecha de Nacimiento"
          id="fecha-nac"
          name="fecha-nac"
          type="date"
          required
        />

        <FormInput
          label="Nombre Completo"
          id="nombre"
          name="nombre"
          placeholder="Nombres y Apellidos"
          required
        />

        <FormInput
          label="Dirección"
          id="direccion"
          name="direccion"
          placeholder="Dirección completa"
        />

        <FormInput
          label="Teléfono"
          id="telefono"
          name="telefono"
          placeholder="09xxxxxxxx"
        />

        <FormTextarea
          label="Observaciones Adicionales"
          id="observaciones"
          name="observaciones"
          rows={4}
          placeholder="Escriba aquí detalles relevantes..."
        />

        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

export default SolicitudOrganizacionPage;
