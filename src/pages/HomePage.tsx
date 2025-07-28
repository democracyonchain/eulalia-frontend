
const HomePage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        Bienvenido a la Plataforma de Afiliación Política Digital
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Este es el frontend de Eulalia, un sistema para la identidad autosoberana y la trazabilidad política.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Ciudadanos</h3>
          <p className="text-gray-700 dark:text-gray-400">
            Afiliese de forma segura y digital a organizaciones políticas.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Organizaciones</h3>
          <p className="text-gray-700 dark:text-gray-400">
            Gestione sus afiliados de manera transparente y auditable.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Auditores</h3>
          <p className="text-gray-700 dark:text-gray-400">
            Verifique los procesos de afiliación con la confianza de la blockchain.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;