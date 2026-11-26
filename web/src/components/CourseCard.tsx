import { Link } from 'react-router-dom';

export function CourseCard({ curso }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-32 flex items-center justify-center">
        <span className="text-4xl">{categoryEmoji(curso.categoria)}</span>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 leading-snug">{curso.titulo}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{curso.instructor?.nombre} · {curso.lecciones?.length ?? '?'} lecciones</p>
        </div>
        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit">{curso.nivel ?? curso.categoria}</span>
        <Link to={`/cursos/${curso.id}`} className="mt-auto block text-center bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700">
          Ver curso
        </Link>
      </div>
    </div>
  );
}

function categoryEmoji(cat) {
  const map = { Programación: '💻', Diseño: '🎨', Idiomas: '🌍' };
  return map[cat] ?? '📚';
}
