import { Link } from 'react-router-dom';
import type { Curso } from '../types';

const CATEGORY_CONFIG = {
  'Programación': {
    gradient: 'from-blue-700 via-blue-800 to-indigo-900',
    badge: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    icon: '💻',
  },
  'Diseño': {
    gradient: 'from-rose-400 via-rose-500 to-orange-500',
    badge: 'bg-rose-100/80 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    icon: '✦',
  },
  'Idiomas': {
    gradient: 'from-emerald-500 via-teal-500 to-teal-700',
    badge: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: '◎',
  },
};

const DEFAULT_CONFIG = {
  gradient: 'from-brand-500 via-brand-600 to-brand-700',
  badge: 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300',
  icon: '◈',
};

const LEVEL_CONFIG = {
  'Básico':     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Intermedio': 'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300',
  'Avanzado':   'bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-300',
};

export function CourseCard({ curso }: { curso: Curso & { nivel?: string } }) {
  const config = CATEGORY_CONFIG[curso.categoria as keyof typeof CATEGORY_CONFIG] ?? DEFAULT_CONFIG;
  const levelStyle = LEVEL_CONFIG[curso.nivel as keyof typeof LEVEL_CONFIG] ?? 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300';

  return (
    <div className="bg-card rounded-2xl overflow-hidden card-hover border border-theme flex flex-col group shadow-card dark:shadow-card-dark">
      {/* Colored header */}
      <div className={`bg-gradient-to-br ${config.gradient} h-36 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-15"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none">
          {config.icon}
        </span>
        <div className={`absolute top-3 right-3 ${config.badge} text-xs font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm`}>
          {curso.categoria}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-primary leading-snug text-base line-clamp-2">{curso.titulo}</h3>
          <p className="text-xs text-muted mt-1">
            {curso.instructor?.nombre} · {curso.lecciones?.length ?? '?'} lecciones
          </p>
        </div>

        {curso.nivel && (
          <span className={`inline-block text-xs font-medium ${levelStyle} px-2.5 py-0.5 rounded-full w-fit`}>
            {curso.nivel}
          </span>
        )}

        <Link
          to={`/cursos/${curso.id}`}
          className="mt-auto block text-center gradient-brand text-white text-sm py-2.5 rounded-xl font-medium hover:opacity-90 hover:shadow-glow transition-all duration-200"
        >
          Ver curso →
        </Link>
      </div>
    </div>
  );
}
