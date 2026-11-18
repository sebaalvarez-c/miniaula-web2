import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeccion, completarLeccion } from '../../services/lecciones.service.js';
import { getProgresoCurso } from '../../services/cursos.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ProgressBar } from '../../components/ProgressBar';

export function LessonPage() {
  const { cursoId, leccionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setLoading(true); setError('');
    Promise.all([getLeccion(leccionId), getProgresoCurso(cursoId)])
      .then(([d, p]) => { setData(d); setProgreso(p); })
      .catch((e) => setError(e.response?.data?.error?.message || 'Lección bloqueada o no disponible'))
      .finally(() => setLoading(false));
  }, [leccionId, cursoId]);

  useEffect(() => {
    if (data?.leccion?.tipo === 'cuestionario') {
      navigate(`/cursos/${cursoId}/lecciones/${leccionId}/quiz`, { replace: true });
    }
  }, [data, cursoId, leccionId, navigate]);

  const handleCompletar = async () => {
    setCompleting(true);
    try {
      await completarLeccion(leccionId);
      const p = await getProgresoCurso(cursoId);
      setProgreso(p);
      const idx = p.lecciones.findIndex((l) => l.leccionId === leccionId);
      const next = p.lecciones[idx + 1];
      if (next) navigate(`/cursos/${cursoId}/lecciones/${next.leccionId}`);
      else setCompleted(true);
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Error');
    } finally { setCompleting(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Link to={`/cursos/${cursoId}`} className="text-xs text-blue-600 hover:underline">← Volver al curso</Link>
            {progreso && (
              <>
                <div className="mt-3 mb-2"><ProgressBar value={progreso.porcentaje} /></div>
                <div className="flex flex-col gap-1 mt-3">
                  {progreso.lecciones.map((l, i) => {
                    const isActive = l.leccionId === leccionId;
                    const isLocked = !l.completada && i > 0 && !progreso.lecciones[i - 1].completada;
                    return (
                      <div key={l.leccionId}
                        onClick={() => !isLocked && navigate(`/cursos/${cursoId}/lecciones/${l.leccionId}`)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors
                          ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <span className="text-xs w-5">{l.completada ? '✓' : isLocked ? '🔒' : ''}</span>
                        <span className="truncate">{l.titulo}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {completed ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Curso completado!</h2>
              <p className="text-gray-500 mb-6">Terminaste todas las lecciones del curso. ¡Excelente trabajo!</p>
              <Link to="/mis-cursos" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Ver mis cursos</Link>
            </div>
          ) : error ? <ErrorMessage message={error} /> : data?.leccion?.tipo === 'cuestionario' ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-500">Redirigiendo al cuestionario...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h1 className="text-xl font-bold mb-4">{data?.leccion?.titulo}</h1>
              {data?.leccion?.videoUrl && (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <a href={data.leccion.videoUrl} target="_blank" rel="noreferrer"
                    className="flex flex-col items-center gap-2 text-white hover:text-blue-300">
                    <span className="text-5xl">▶</span>
                    <span className="text-sm">Ver video</span>
                  </a>
                </div>
              )}
              {data?.leccion?.contenido && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.leccion.contenido}</p>}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-700">‹ Anterior</button>
                <button onClick={handleCompletar} disabled={completing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {completing ? 'Marcando...' : 'Marcar como completada'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
