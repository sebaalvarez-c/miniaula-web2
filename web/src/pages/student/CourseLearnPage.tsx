import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgreso } from '../../hooks/useProgreso.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export function CourseLearnPage() {
  const { cursoId = '' } = useParams<{ cursoId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useProgreso(cursoId);

  useEffect(() => {
    if (!data) return;
    const next = data.lecciones.find((l) => !l.completada) ?? data.lecciones[0];
    if (next) {
      navigate(`/cursos/${cursoId}/lecciones/${next.leccionId}`, { replace: true });
    } else {
      navigate(`/cursos/${cursoId}`, { replace: true });
    }
  }, [data, cursoId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  return <LoadingSpinner />;
}
