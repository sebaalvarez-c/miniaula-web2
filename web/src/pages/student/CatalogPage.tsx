import { useState, useEffect } from 'react';
import { getCatalogo } from '../../services/cursos.service.js';
import { CourseCard } from '../../components/CourseCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ErrorMessage } from '../../components/ErrorMessage';

const CATEGORIAS = ['Todas', 'Programación', 'Diseño', 'Idiomas'];

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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Buscar cursos por título..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIAS.map((c) => (
          <button key={c} onClick={() => { setCategoria(c); setPage(1); }}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${categoria === c ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : cursos.length === 0 ? (
        <EmptyState title="No hay cursos disponibles" subtitle="Probá con otro filtro o búsqueda" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cursos.map((c) => <CourseCard key={c.id} curso={c} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-md text-sm ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:border-blue-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
