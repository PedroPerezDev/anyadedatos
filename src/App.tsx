import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { supabase, type Persona } from './supabase';

type FormState = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(true);

  useEffect(() => {
    fetchPersonas();
  }, []);

  async function fetchPersonas() {
    setLoadingPersonas(true);
    const { data } = await supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPersonas(data);
    setLoadingPersonas(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) return;

    setFormState('loading');
    setErrorMsg('');

    const { error } = await supabase
      .from('personas')
      .insert({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: edad !== '' ? parseInt(edad, 10) : null,
      });

    if (error) {
      setFormState('error');
      setErrorMsg(error.message);
      return;
    }

    setFormState('success');
    setNombre('');
    setApellido('');
    setEdad('');
    await fetchPersonas();

    setTimeout(() => setFormState('idle'), 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">AñadeDatos</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Nueva persona</h2>
            <p className="text-sm text-slate-500 mt-1">Introduce un nombre y apellido para guardarlos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="ej. María"
                disabled={formState === 'loading'}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-slate-700 mb-1.5">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                placeholder="ej. García"
                disabled={formState === 'loading'}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            {formState === 'error' && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg || 'Ha ocurrido un error.'}</span>
              </div>
            )}

            {formState === 'success' && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
                <CheckCircle size={16} className="shrink-0" />
                <span>Persona guardada correctamente.</span>
              </div>
            )}

            <div>
              <label htmlFor="edad" className="block text-sm font-medium text-slate-700 mb-1.5">
                Edad <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                id="edad"
                type="number"
                min={0}
                max={150}
                value={edad}
                onChange={e => setEdad(e.target.value)}
                placeholder="ej. 34"
                disabled={formState === 'loading'}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'loading' || !nombre.trim() || !apellido.trim()}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {formState === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando…
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Añadir persona
                </>
              )}
            </button>
          </form>
        </div>

        {/* List card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Personas guardadas
            {!loadingPersonas && (
              <span className="ml-2 text-sm font-normal text-slate-400">({personas.length})</span>
            )}
          </h2>

          {loadingPersonas ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : personas.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aún no hay personas guardadas.</p>
          ) : (
            <ul className="space-y-2">
              {personas.map(p => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {p.nombre[0]}{p.apellido[0]}
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {p.nombre} {p.apellido}
                  </span>
                  <div className="ml-auto flex items-center gap-3">
                    {p.edad != null && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {p.edad} años
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
