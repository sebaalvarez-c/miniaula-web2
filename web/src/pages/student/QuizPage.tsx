import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeccion, submitIntento } from '../../services/lecciones.service.js';
import { getProgresoCurso } from '../../services/cursos.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export function QuizPage() {
  const { cursoId, leccionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLeccion(leccionId)
      .then((d) => { setData(d); setRespuestas(new Array(d.preguntas?.length ?? 0).fill(null)); })
      .catch((e) => setError(e.response?.data?.error?.message || 'Error'))
      .finally(() => setLoading(false));
  }, [leccionId]);

  const handleSubmit = async () => {
    if (respuestas.some((r) => r === null)) { setError('Respondé todas las preguntas'); return; }
    setSubmitting(true); setError('');
    try {
      const r = await submitIntento(leccionId, respuestas);
      setResult(r);
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Error');
    } finally { setSubmitting(false); }
  };

  const goNext = async () => {
    const p = await getProgresoCurso(cursoId);
    const idx = p.lecciones.findIndex((l) => l.leccionId === leccionId);
    const next = p.lecciones[idx + 1];
    if (next) navigate(`/cursos/${cursoId}/lecciones/${next.leccionId}`);
    else navigate(`/cursos/${cursoId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-1">{data?.leccion?.titulo}</h1>
        <p className="text-sm text-gray-400 mb-6">
          Intento {(data?.progreso?.intentos ?? 0) + 1} de 3 · {data?.preguntas?.length} preguntas · Nota mínima: {data?.leccion?.notaMinima ?? 60}
        </p>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <div className="flex flex-col gap-4">
          {data?.preguntas?.map((p, qi) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-medium mb-3">{qi + 1}. {p.enunciado}</p>
              <div className="flex flex-col gap-2">
                {p.opciones.map((op, oi) => (
                  <label key={oi} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                    ${respuestas[qi] === oi ? 'bg-blue-50 border border-blue-200' : 'border border-transparent hover:bg-gray-50'}`}>
                    <input type="radio" name={`q${qi}`} checked={respuestas[qi] === oi} onChange={() => {
                      const r = [...respuestas]; r[qi] = oi; setRespuestas(r);
                    }} className="accent-blue-600" />
                    <span className="text-sm">{op}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!result && (
          <button onClick={handleSubmit} disabled={submitting || (data?.progreso?.intentos ?? 0) >= 3}
            className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Enviando...' : 'Enviar respuestas'}
          </button>
        )}
      </div>

      {result && (
        <aside className="w-full lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center sticky top-20">
            <p className="text-xs text-gray-400 mb-1">Resultado</p>
            <p className="text-4xl font-bold text-gray-900">{result.nota}<span className="text-lg text-gray-400"> / 100</span></p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${result.aprobado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.aprobado ? 'Aprobado' : 'Reprobado'}
            </span>
            <p className="text-xs text-gray-400 mt-3">Mejor nota: {result.mejorNota}</p>
            <p className="text-xs text-gray-400">Te queda{result.intentosRestantes !== 1 ? 'n' : ''} {result.intentosRestantes} intento{result.intentosRestantes !== 1 ? 's' : ''}</p>
            {result.aprobado ? (
              <button onClick={goNext} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                Siguiente lección →
              </button>
            ) : result.intentosRestantes > 0 ? (
              <button onClick={() => { setResult(null); setRespuestas(new Array(data.preguntas.length).fill(null)); setLoading(true); getLeccion(leccionId).then(setData).finally(() => setLoading(false)); }}
                className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50">
                Reintentar
              </button>
            ) : null}
          </div>
        </aside>
      )}
    </div>
  );
}
