const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Plataforma de Afiliación Política Digital
        </h2>
        <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
          Sistema nacional para la gestión de identidades autosoberanas y trazabilidad política, garantizando transparencia y seguridad mediante tecnología blockchain.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="inst-card p-8 border-t-4 border-t-blue-600 hover:border-blue-700">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-800">Ciudadanos</h3>
          <p className="text-slate-600 leading-relaxed">
            Afíliese de forma segura a organizaciones políticas y gestione su identidad digital soberana.
          </p>
        </div>

        <div className="inst-card p-8 border-t-4 border-t-indigo-600 hover:border-indigo-700">
          <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-indigo-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-800">Organizaciones</h3>
          <p className="text-slate-600 leading-relaxed">
            Gestione procesos de afiliación y mantenga padrones actualizados de forma transparente.
          </p>
        </div>

        <div className="inst-card p-8 border-t-4 border-t-emerald-600 hover:border-emerald-700">
          <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-emerald-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-800">Auditores</h3>
          <p className="text-slate-600 leading-relaxed">
            Verifique la integridad del proceso electoral y de afiliación mediante contratos inteligentes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
