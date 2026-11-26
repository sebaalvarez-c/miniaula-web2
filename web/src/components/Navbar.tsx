import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../context/ThemeContext';

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="glass sticky top-0 z-50 border-b border-theme">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1c1a16] dark:bg-[#1f1f1f] dark:border dark:border-white/15">
            <span className="font-bold text-sm text-[#f4f0e8]">M</span>
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--accent)' }}>MiniAula</span>
        </Link>

        <nav className="flex items-center gap-1">
          {user?.rol === 'estudiante' && (
            <>
              <Link to="/catalogo" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-primary hover:bg-accent-soft transition-all">
                Catálogo
              </Link>
              <Link to="/mis-cursos" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-primary hover:bg-accent-soft transition-all">
                Mis cursos
              </Link>
            </>
          )}
          {user?.rol === 'instructor' && (
            <>
              <Link to="/instructor/cursos" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-primary hover:bg-accent-soft transition-all">
                Mis cursos
              </Link>
              <Link to="/instructor/panel" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-primary hover:bg-accent-soft transition-all">
                Panel
              </Link>
            </>
          )}

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-accent-soft transition-all"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/perfil" className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-glow-sm">
                  {user.nombre?.[0]?.toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-red-600 dark:hover:text-red-400 transition-all">
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-1.5 rounded-lg text-sm font-medium gradient-brand text-white shadow-glow-sm hover:shadow-glow hover:opacity-90 transition-all">
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
