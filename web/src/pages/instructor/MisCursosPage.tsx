import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMisCursos, createCurso, deleteCurso, updateEstado } from '../../services/cursos.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ErrorMessage } from '../../components/ErrorMessage';
import { getApiError } from '../../lib/api-error';
import type { Curso } from '../../types';

const ESTADO_BADGE: Record<string, string> = {
  borrador: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
  publicado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  archivado: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export function InstructorMisCursosPage() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    getMisCursos().then(setCursos).catch((e) => setError(getApiError(e, 'Error'))).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleNew = async () => {
    setCreating(true);
    try {
      const c = await createCurso({ titulo: 'Nuevo curso', categoria: 'Programación', nivel: 'Básico' });
      navigate(`/instructor/cursos/${c.id}`);
    } catch (e) {
      setError(getApiError(e, 'Error'));
    } finally { setCreating(false); }
  };

  const handlePublish = async (id: string, estado: string) => {
    try { await updateEstado(id, estado); load(); }
    catch (e) { setError(getApiError(e, 'Error')); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try { await deleteCurso(id); load(); }
    catch (e) { setError(getApiError(e, 'Error')); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-primary">Mis cursos</h1>
        <button onClick={handleNew} disabled={creating}
          className="gradient-brand px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
          {creating ? 'Creando...' : '+ Nuevo curso'}
        </button>
      </div>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {cursos.length === 0 ? (
        <EmptyState title="Todavía no creaste ningún curso" subtitle="Creá tu primer curso y empezá a enseñar" />
      ) : (
        <div className="flex flex-col gap-3">
          {cursos.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-theme p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-primary">{c.titulo}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_BADGE[c.estado]}`}>{c.estado}</span>
                </div>
                <p className="text-xs text-muted mt-1">{c.lecciones?.length} lecciones · {c.categoria}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to={`/instructor/cursos/${c.id}`} className="text-sm border border-theme text-muted px-3 py-1 rounded-lg hover:text-primary hover:border-brand-400 transition-colors">Editar</Link>
                <Link to={`/instructor/panel/${c.id}`} className="text-sm border border-theme text-muted px-3 py-1 rounded-lg hover:text-primary hover:border-brand-400 transition-colors">Panel</Link>
                {c.estado === 'borrador' && (
                  <button onClick={() => handlePublish(c.id, 'publicado')} className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">Publicar</button>
                )}
                {c.estado === 'publicado' && (
                  <button onClick={() => handlePublish(c.id, 'archivado')} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors">Archivar</button>
                )}
                {c.estado === 'borrador' && (
                  <button onClick={() => handleDelete(c.id)} className="text-sm text-red-500 border border-red-300 dark:border-red-800 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
