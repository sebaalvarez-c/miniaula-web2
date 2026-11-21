    import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cursosService, Curso } from '../../services/cursos.service';

export const PanelPage: React.FC = () => {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMisCursos = async () => {
      try {
        const data = await cursosService.getAll();
        // Filtra los cursos creados por el instructor autenticado si incluyen instructorId
        const propios = user
          ? data.filter((c: any) => !c.instructorId || c.instructorId === user.id)
          : data;
        setCursos(propios);
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message ||
            'No se pudo cargar el resumen del panel',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMisCursos();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Panel de Instructor
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}. Gestiona tus cursos y contenidos.
          </p>
        </div>

        <Link
          to="/instructor/cursos"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition"
        >
          Ver mis cursos
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Cursos publicados</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : cursos.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Rol de cuenta</p>
          <p className="text-xl font-semibold text-blue-600 mt-2 capitalize">
            {user?.rol || 'Instructor'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Gestión académica</p>
          <Link
            to="/instructor/cursos"
            className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            Administrar lecciones y evaluaciones →
          </Link>
        </div>
      </div>

      {/* Últimos cursos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Cursos recientes</h2>
          <Link
            to="/instructor/cursos"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Ver todos
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aún no tienes cursos registrados.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {cursos.slice(0, 5).map((curso) => (
              <div
                key={curso.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{curso.titulo}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {curso.descripcion}
                  </p>
                </div>
                <Link
                  to={`/cursos/${curso.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline shrink-0"
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelPage;