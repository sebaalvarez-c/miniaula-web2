import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCursoDetalle, inscribir } from '../../services/cursos.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useAuth } from '../../hooks/useAuth.js';

export function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    getCursoDetalle(id).then(setCurso).catch((e) => setError(e.response?.data?.error?.message || 'Error')).finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true); setEnrollError('');
    try {
      await inscribir(id);
      navigate(`/cursos/${id}/aprender`);
    } catch (e) {
      const msg = e.response?.data?.error?.message || 'Error al inscribirse';
      if (e.response?.status === 409) navigate(`/cursos/${id}/aprender`);
      else setEnrollError(msg);
    } finally { setEnrolling(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{curso.titulo}</h1>
            <p className="text-gray-500 text-sm mt-1">{curso.instructor?.nombre} · {curso.nivel} · {curso.categoria}</p>
          </div>
          {user?.rol === 'estudiante' && (
            <button onClick={handleEnroll} disabled={enrolling}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shrink-0">
              {enrolling ? 'Inscribiendo...' : 'Inscribirse'}
            </button>
          )}
        </div>
        {curso.descripcion && <p className="text-gray-600 mt-4">{curso.descripcion}</p>}
        {enrollError && <div className="mt-3"><ErrorMessage message={enrollError} /></div>}
      </div>

      <h2 className="font-semibold mb-3">Temario ({curso.lecciones?.length} lecciones)</h2>
      <div className="bg-white rounded-xl border border-gray-200 divide-y">
        {curso.lecciones?.map((l) => (
          <div key={l.id} className="px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6">{l.orden}.</span>
            <span className="flex-1 text-sm">{l.titulo}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${l.tipo === 'cuestionario' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
              {l.tipo === 'cuestionario' ? 'Cuestionario' : 'Contenido'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
