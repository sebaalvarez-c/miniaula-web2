import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-blue-600 font-bold text-lg">MiniAula</Link>

        <nav className="flex items-center gap-4">
          {user?.rol === 'estudiante' && (
            <>
              <Link to="/catalogo" className="text-sm text-gray-600 hover:text-blue-600">Catálogo</Link>
              <Link to="/mis-cursos" className="text-sm text-gray-600 hover:text-blue-600">Mis cursos</Link>
            </>
          )}
          {user?.rol === 'instructor' && (
            <>
              <Link to="/instructor/cursos" className="text-sm text-gray-600 hover:text-blue-600">Mis cursos</Link>
              <Link to="/instructor/panel" className="text-sm text-gray-600 hover:text-blue-600">Panel</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/perfil" className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                {user.nombre?.[0]?.toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Ingresar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
