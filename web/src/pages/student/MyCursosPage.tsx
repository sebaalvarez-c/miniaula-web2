import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisInscripciones } from '../../services/inscripciones.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ProgressBar } from '../../components/ProgressBar';

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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-2">Mis cursos</h1>
      <p className="text-gray-400 text-sm mb-6">{inscripciones.length} curso{inscripciones.length !== 1 ? 's' : ''} inscripto{inscripciones.length !== 1 ? 's' : ''}</p>
      {error ? <ErrorMessage message={error} /> : inscripciones.length === 0 ? (
        <EmptyState title="No estás inscripto en ningún curso" subtitle="Explorá el catálogo y encontrá algo que te interese"
          action={<Link to="/catalogo" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Ver catálogo</Link>} />
      ) : (
        <div className="flex flex-col gap-3">
          {inscripciones.map((insc) => (
            <div key={insc.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center text-2xl shrink-0">📚</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{insc.curso?.titulo}</h3>
                <p className="text-xs text-gray-400">{insc.curso?.instructor?.nombre} · {insc.curso?.categoria}</p>
                <div className="mt-2"><ProgressBar value={insc.porcentaje} /></div>
              </div>
              <Link to={`/cursos/${insc.cursoId}/aprender`}
                className="shrink-0 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                {insc.porcentaje === 0 ? 'Empezar' : insc.porcentaje === 100 ? 'Repasar' : 'Continuar'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
