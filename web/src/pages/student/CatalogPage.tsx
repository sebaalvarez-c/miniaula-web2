import { useState, useEffect } from 'react';
import { getCatalogo } from '../../services/cursos.service.js';
import { CourseCard } from '../../components/CourseCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ErrorMessage } from '../../components/ErrorMessage';

const CATEGORIAS = [
  { label: 'Todas',        icon: '✦' },
  { label: 'Programación', icon: '💻' },
  { label: 'Diseño',       icon: '✦' },
  { label: 'Idiomas',      icon: '◎' },
];

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

export function CatalogPage() {
  const [cursos, setCursos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    setLoading(true); setError('');
    getCatalogo({ q, categoria, page, limit })
      .then((data) => { setCursos(data.data); setTotal(data.total); })
      .catch((e) => setError(e.response?.data?.error?.message || 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, [q, categoria, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle at 15% 60%, #c47a24 0%, transparent 50%), radial-gradient(circle at 85% 20%, #d4a040 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-12 pb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Descubrí tu próximo{' '}
            <span style={{ color: 'var(--accent)' }}>aprendizaje</span>
          </h1>
          <p className="text-muted text-base mb-8">
            {total > 0 ? `${total} curso${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}` : 'Explorá nuestro catálogo'}
          </p>

          <div className="relative max-w-xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon />
            </div>
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Buscar cursos por título..."
              className="w-full bg-card border border-theme rounded-xl pl-11 pr-4 py-3 text-sm text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-card transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setCategoria(label); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                categoria === label
                  ? 'gradient-brand text-white border-transparent shadow-glow-sm'
                  : 'bg-card border-theme text-muted hover:border-brand-400 hover:text-primary'
              }`}
            >
              <span className="text-xs">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : cursos.length === 0 ? (
          <EmptyState title="No hay cursos disponibles" subtitle="Probá con otro filtro o búsqueda" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {cursos.map((c) => <CourseCard key={c.id} curso={c} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all border ${
                      page === p
                        ? 'gradient-brand text-white border-transparent shadow-glow-sm'
                        : 'bg-card border-theme text-muted hover:border-brand-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
