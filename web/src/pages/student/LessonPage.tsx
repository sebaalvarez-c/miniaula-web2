import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getLeccion, completarLeccion } from '../../services/lecciones.service';
import { getProgresoCurso } from '../../services/cursos.service';
import { getApiError } from '../../lib/api-error';
import type { Leccion, ProgresoData, ProgresoLeccionItem } from '../../types';

export const LessonPage: React.FC = () => {
  const { cursoId, leccionId } = useParams<{ cursoId: string; leccionId: string }>();
  const navigate = useNavigate();
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [progreso, setProgreso] = useState<ProgresoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!leccionId || !cursoId) return;
    setLoading(true); setError('');
    Promise.all([getLeccion(leccionId), getProgresoCurso(cursoId)])
      .then(([d, p]) => {
        const lec: Leccion = d.leccion ?? d;
        setLeccion(lec);
        setProgreso(p);
        if (lec.tipo === 'cuestionario') {
          navigate(`/cursos/${cursoId}/lecciones/${leccionId}/quiz`, { replace: true });
        }
      })
      .catch((err: unknown) => setError(getApiError(err, 'Lección no disponible')))
      .finally(() => setLoading(false));
  }, [leccionId, cursoId]);

  const handleCompletar = async () => {
    if (!leccionId || !cursoId) return;
    setCompleting(true);
    try {
      await completarLeccion(leccionId);
      const p: ProgresoData = await getProgresoCurso(cursoId);
      setProgreso(p);
      const idx = p.lecciones.findIndex((l: ProgresoLeccionItem) => l.leccionId === leccionId);
      const next = p.lecciones[idx + 1];
      if (next) navigate(`/cursos/${cursoId}/lecciones/${next.leccionId}`);
      else setCompleted(true);
    } catch (err: unknown) {
      setError(getApiError(err, 'Error al completar'));
    } finally { setCompleting(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-4 border-brand-100 dark:border-brand-900/30 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl border border-theme p-10">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">¡Curso completado!</h2>
          <p className="text-muted mb-6">Terminaste todas las lecciones. ¡Excelente trabajo!</p>
          <Link to="/mis-cursos" className="gradient-brand text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all inline-block">
            Ver mis cursos
          </Link>
        </div>
      </div>
    );
  }

  if (error || !leccion) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error || 'Lección no encontrada'}
        </div>
      </div>
    );
  }

  const indiceActual = progreso?.lecciones.findIndex((l) => l.leccionId === leccionId) ?? -1;
  const anterior = indiceActual > 0 ? progreso?.lecciones[indiceActual - 1] : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 flex-col lg:flex-row animate-fade-in">
      {/* Sidebar */}
      {progreso && (
        <aside className="w-full lg:w-56 shrink-0">
          <div className="bg-card rounded-xl border border-theme p-4 sticky top-6">
            <Link to={`/cursos/${cursoId}`} className="text-xs text-muted hover:text-primary transition-colors">← Volver al curso</Link>
            <div className="mt-3 mb-1">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Progreso</span>
                <span>{progreso.porcentaje}%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full gradient-brand transition-all duration-500" style={{ width: `${progreso.porcentaje}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5 mt-3">
              {progreso.lecciones.map((l: ProgresoLeccionItem, i: number) => {
                const isActive = l.leccionId === leccionId;
                const isLocked = !l.completada && i > 0 && !progreso.lecciones[i - 1].completada;
                return (
                  <div
                    key={l.leccionId}
                    onClick={() => !isLocked && navigate(`/cursos/${cursoId}/lecciones/${l.leccionId}`)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isActive ? 'bg-brand-light dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium'
                        : isLocked ? 'text-subtle cursor-not-allowed opacity-50'
                        : 'text-muted hover:bg-surface'
                    }`}
                  >
                    <span className="w-4 shrink-0">{l.completada ? '✓' : isLocked ? '🔒' : ''}</span>
                    <span className="truncate">{l.titulo}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <article className="bg-card rounded-2xl border border-theme overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div className="bg-[#1c1a16] px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-white leading-tight">{leccion.titulo}</h1>
              <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
                Lección {leccion.orden}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {leccion.videoUrl && (
              <div className="mb-8 aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                <iframe src={leccion.videoUrl} title={leccion.titulo} className="w-full h-full" allowFullScreen />
              </div>
            )}

            {leccion.contenido && (
              <div className="text-primary leading-relaxed whitespace-pre-line text-[15px]">
                {leccion.contenido}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
              <button
                onClick={() => anterior && navigate(`/cursos/${cursoId}/lecciones/${anterior.leccionId}`)}
                disabled={!anterior}
                className="text-sm text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <button
                onClick={handleCompletar}
                disabled={completing}
                className="gradient-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 hover:shadow-glow transition-all disabled:opacity-50"
              >
                {completing ? 'Guardando...' : 'Completar y continuar →'}
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default LessonPage;
