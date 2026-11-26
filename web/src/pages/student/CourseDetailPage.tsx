import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCursoDetalle, inscribir } from '../../services/cursos.service.js';
import { getMisInscripciones } from '../../services/inscripciones.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useAuth } from '../../hooks/useAuth.js';

const CAT_GRADIENT = {
  'Programación': 'from-violet-500 via-purple-500 to-indigo-600',
  'Diseño': 'from-pink-500 via-rose-500 to-orange-500',
  'Idiomas': 'from-cyan-500 via-teal-500 to-emerald-500',
};
const CAT_ICON = { 'Programación': '💻', 'Diseño': '🎨', 'Idiomas': '🌍' };

export function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [inscripto, setInscripto] = useState(false);

  useEffect(() => {
    getCursoDetalle(id).then(setCurso).catch((e) => setError(e.response?.data?.error?.message || 'Error')).finally(() => setLoading(false));
    if (user?.rol === 'estudiante') {
      getMisInscripciones().then((ins) => {
        setInscripto(ins.some((i: any) => i.cursoId === id));
      }).catch(() => {});
    }
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true); setEnrollError('');
    try {
      await inscribir(id);
      navigate(`/cursos/${id}/aprender`);
    } catch (e) {
      if (e.response?.status === 409) navigate(`/cursos/${id}/aprender`);
      else setEnrollError(e.response?.data?.error?.message || 'Error al inscribirse');
    } finally { setEnrolling(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  const gradient = CAT_GRADIENT[curso.categoria] ?? 'from-brand-500 via-brand-600 to-purple-600';
  const icon = CAT_ICON[curso.categoria] ?? '📚';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden border border-theme mb-6" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div className={`bg-gradient-to-br ${gradient} px-8 py-10 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <span className="text-6xl mb-4 block">{icon}</span>
            <h1 className="text-3xl font-extrabold text-white leading-tight">{curso.titulo}</h1>
            <p className="text-white/70 mt-2 text-sm">
              Por {curso.instructor?.nombre} · {curso.nivel} · {curso.categoria}
            </p>
          </div>
        </div>

        <div className="bg-card p-6">
          {curso.descripcion && (
            <p className="text-muted text-sm leading-relaxed mb-5">{curso.descripcion}</p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-lg">📖</span>
              {curso.lecciones?.length ?? 0} lecciones
            </div>
            {curso.nivel && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-brand-light dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                {curso.nivel}
              </span>
            )}
          </div>

          {enrollError && <div className="mt-4"><ErrorMessage message={enrollError} /></div>}

          {user?.rol === 'estudiante' && (
            inscripto ? (
              <button
                onClick={() => navigate(`/cursos/${id}/aprender`)}
                className="mt-5 w-full gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:shadow-glow transition-all"
              >
                Ir al curso →
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="mt-5 w-full gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:shadow-glow transition-all disabled:opacity-50"
              >
                {enrolling ? 'Inscribiendo...' : 'Inscribirse al curso'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Lessons list */}
      <h2 className="font-bold text-primary text-lg mb-4">Temario · {curso.lecciones?.length} lecciones</h2>
      <div className="bg-card rounded-2xl border border-theme overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {curso.lecciones?.map((l, idx) => (
          <div
            key={l.id}
            className={`px-5 py-4 flex items-center gap-4 ${idx !== 0 ? 'border-t border-theme' : ''} hover:bg-brand-light dark:hover:bg-white/5 transition-colors`}
          >
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
              {l.orden}
            </div>
            <span className="flex-1 text-sm text-primary">{l.titulo}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              l.tipo === 'cuestionario'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
            }`}>
              {l.tipo === 'cuestionario' ? '📝 Quiz' : '📄 Contenido'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
