import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchIdentityProfile, fetchWalletStatus, type IdentityProfile } from '../../services/identityService';
import { fetchAfiliaciones } from '../../services/afiliacionService';
import { fetchOrganizacionDetail } from '../../services/organizacionService';

function HomePage() {
  const { cedula } = useContext(AuthContext);
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [afiliacionEstado, setAfiliacionEstado] = useState<string>('NO AFILIADO');
  const [organizacionNombre, setOrganizacionNombre] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cedula) return;

    const loadData = async () => {
      try {
        const profileData = await fetchIdentityProfile(cedula);
        setProfile(profileData);
        // Try fetching wallet status, but don't block if it fails (optional feature)
        try {
          const wallet = await fetchWalletStatus(cedula);
          setWalletStatus(wallet);
        } catch (e) {
          console.log("Wallet status not available yet");
        }

        try {
          const afiliaciones = await fetchAfiliaciones();
          const activa = afiliaciones.find((a) => a.cedula === cedula && a.estado !== 'Anulado');
          if (activa) {
            setAfiliacionEstado('AFILIADO');
            try {
              const org = await fetchOrganizacionDetail(activa.organizacionId);
              setOrganizacionNombre(org.nombre);
            } catch (_) {
              setOrganizacionNombre('Organización no disponible');
            }
          }
        } catch (_) {
          setAfiliacionEstado('NO AFILIADO');
        }
      } catch (err) {
        setError("No se pudo cargar la información del ciudadano.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [cedula]);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-600 font-medium">Cargando perfil del ciudadano...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-semibold bg-red-50 border border-red-200 rounded m-4">{error}</div>;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Panel de Ciudadano
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Bienvenido, <span className="font-semibold text-slate-700">{profile ? `${profile.nombre} ${profile.apellido}` : "Usuario"}</span>. Gestione sus acreditaciones oficiales.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Identidad */}
        <div className="inst-card p-6 border-t-4 border-t-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 p-2 rounded text-slate-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.627-1 2.132-2.8.8-5 .8-7.8 0a3.001 3.001 0 00-1-2.132"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Identidad Digital</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">DNI / Documento</label>
              <p className="text-xl font-mono text-slate-900 mt-1">{profile?.cedula}</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Identificador DID</label>
              <div className="bg-slate-50 text-xs text-slate-600 font-mono break-all p-2 rounded border border-slate-200 mt-1">
                {walletStatus?.did || profile?.did || "No emitido"}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Afiliación */}
        <div className="inst-card p-6 border-t-4 border-t-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 p-2 rounded text-blue-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Afiliación Política</h3>
          </div>

          <div className="mb-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${afiliacionEstado === 'AFILIADO'
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-600'
                }`}>
              {afiliacionEstado}
            </span>
          </div>

          {organizacionNombre ? (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Organización</label>
              <p className="text-lg font-medium text-slate-900 mt-1">{organizacionNombre}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No se encuentra afiliado a ninguna organización registrada.</p>
          )}
        </div>

        {/* Tarjeta de Wallet / Integraciones */}
        <div className="inst-card p-6 border-t-4 border-t-indigo-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-50 p-2 rounded text-indigo-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Credenciales Verificables</h3>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Estado de Conexión</span>
              <span className="flex items-center text-emerald-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                {walletStatus?.estado || "Inactivo"}
              </span>
            </div>

            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors flex justify-center items-center gap-2">
              <span>Abrir Billetera</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
