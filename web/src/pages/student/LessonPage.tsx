import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { leccionesService, Leccion } from '../../services/lecciones.service';

export const LessonPage: React.FC = () => {
  const { leccionId } = useParams<{ leccionId: string }>();
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeccion = async () => {
      if (!leccionId) return;
      try {
        const data = await leccionesService.getById(Number(leccionId));
        setLeccion(data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'No se pudo cargar la lección');
      } finally {
        setLoading(false);
      }
    };
    fetchLeccion();
  }, [leccionId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando lección...</div>;
  }

  if (error || !leccion) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error || 'Lección no encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={`/cursos/${leccion.cursoId}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Volver al curso
        </Link>
        <span className="text-sm text-gray-500">
          Lección #{leccion.orden} · {leccion.duracionMinutos} min
        </span>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {leccion.titulo}
        </h1>

        {leccion.videoUrl && (
          <div className="mb-6 aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={leccion.videoUrl}
              title={leccion.titulo}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
          {leccion.contenido}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <Link
            to={`/lecciones/${leccion.id}/quiz`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Realizar cuestionario de la lección →
          </Link>
        </div>
      </article>
    </div>
  );
};

export default LessonPage;