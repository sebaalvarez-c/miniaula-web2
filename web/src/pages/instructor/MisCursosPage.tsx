import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cursosService, Curso } from '../../services/cursos.service';

export const MisCursosPage: React.FC = () => {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarCursos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await cursosService.getAll();
      const propios = user
        ? data.filter((c: any) => !c.instructorId || c.instructorId === user.id)
        : data;
      setCursos(propios);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          'Error al cargar tus cursos',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, [user]);

  const handleEliminar = async (id: number, titulo: string) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar el curso "${titulo}"?`,
    );
    if (!confirmado) return;

    try {
      await cursosService.remove(id);
      setCursos((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          'No se pudo eliminar el curso',
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/instructor/panel"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Volver al panel
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Mis Cursos (Instructor)
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Cargando listado de cursos...
        </div>
      ) : cursos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No tienes cursos creados todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between p-6"
            >
              <div>
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 mb-3">
                  {curso.categoria || 'General'}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {curso.titulo}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {curso.descripcion}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link
                  to={`/cursos/${curso.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Ver curso
                </Link>

                <button
                  type="button"
                  onClick={() => handleEliminar(curso.id, curso.titulo)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursosPage;