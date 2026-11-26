import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisInscripciones } from '../../services/inscripciones.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ProgressBar } from '../../components/ProgressBar';

const CAT_ICONS = { 'Programación': '💻', 'Diseño': '🎨', 'Idiomas': '🌍' };
const CAT_COLORS = {
  'Programación': 'from-violet-500 to-indigo-600',
  'Diseño': 'from-pink-500 to-rose-500',
  'Idiomas': 'from-cyan-500 to-teal-500',
};

export function MyCursosPage() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMisInscripciones()
      .then(setInscripciones)
      .catch((e) => setError(e.response?.data?.error?.message || 'Error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Mis cursos</h1>
        <p className="text-muted mt-1">
          {inscripciones.length} curso{inscripciones.length !== 1 ? 's' : ''} inscripto{inscripciones.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : inscripciones.length === 0 ? (
        <EmptyState
          title="No estás inscripto en ningún curso"
          subtitle="Explorá el catálogo y encontrá algo que te interese"
          action={
            <Link to="/catalogo" className="mt-2 inline-block gradient-brand text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 hover:shadow-glow transition-all">
              Ver catálogo
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4 animate-fade-in">
          {inscripciones.map((insc) => {
            const cat = insc.curso?.categoria;
            const gradient = CAT_COLORS[cat] ?? 'from-brand-500 to-purple-600';
            const icon = CAT_ICONS[cat] ?? '📚';
            const pct = insc.porcentaje ?? 0;

            return (
              <div key={insc.id} className="bg-card rounded-2xl border border-theme p-5 flex gap-5 items-center card-hover"
                   style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shrink-0 shadow-md`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate text-base">{insc.curso?.titulo}</h3>
                  <p className="text-xs text-muted mt-0.5">{insc.curso?.instructor?.nombre} · {cat}</p>
                  <div className="mt-3">
                    <ProgressBar value={pct} />
                  </div>
                </div>
                <Link
                  to={`/cursos/${insc.cursoId}/aprender`}
                  className={`shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl transition-all ${
                    pct === 100
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                      : 'gradient-brand text-white hover:opacity-90 hover:shadow-glow-sm'
                  }`}
                >
                  {pct === 0 ? 'Empezar' : pct === 100 ? '✓ Completado' : 'Continuar'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
