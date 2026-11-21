import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  preguntasService,
  Pregunta,
  ResultadoIntento,
} from '../../services/preguntas.service';

export const QuizPage: React.FC = () => {
  const { leccionId } = useParams<{ leccionId: string }>();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<Record<number, number>>({});
  const [resultado, setResultado] = useState<ResultadoIntento | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreguntas = async () => {
      if (!leccionId) return;
      try {
        const data = await preguntasService.getByLeccion(Number(leccionId));
        setPreguntas(data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Error al cargar preguntas');
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, [leccionId]);

  const handleSelect = (preguntaId: number, opcionIndex: number) => {
    if (resultado) return;
    setSeleccionadas((prev) => ({ ...prev, [preguntaId]: opcionIndex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leccionId) return;

    const respuestas = Object.entries(seleccionadas).map(([preguntaId, opcionSeleccionada]) => ({
      preguntaId: Number(preguntaId),
      opcionSeleccionada,
    }));

    if (respuestas.length < preguntas.length) {
      setError('Por favor responde todas las preguntas antes de enviar.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res = await preguntasService.submitIntento(Number(leccionId), respuestas);
      setResultado(res);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al enviar el cuestionario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando cuestionario...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/lecciones/${leccionId}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Volver a la lección
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Cuestionario de Evaluación
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {resultado && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              resultado.aprobado
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <p className="font-bold text-lg">
              Puntaje: {resultado.puntaje}% ({resultado.aciertos} de {resultado.totalPreguntas} correctas)
            </p>
            <p className="text-sm mt-1">
              {resultado.aprobado
                ? '¡Felicidades! Has aprobado esta evaluación.'
                : 'No alcanzaste el 70% requerido. Puedes volver a intentarlo.'}
            </p>
          </div>
        )}

        {preguntas.length === 0 ? (
          <p className="text-gray-600">Esta lección aún no tiene preguntas configuradas.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {preguntas.map((pregunta, idx) => (
              <div key={pregunta.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3">
                  {idx + 1}. {pregunta.enunciado}
                </p>
                <div className="space-y-2">
                  {pregunta.opciones.map((opcion, opIdx) => {
                    const checked = seleccionadas[pregunta.id] === opIdx;
                    return (
                      <label
                        key={opIdx}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                          checked
                            ? 'bg-blue-50 border-blue-400 text-blue-900'
                            : 'bg-white border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          checked={checked}
                          disabled={!!resultado}
                          onChange={() => handleSelect(pregunta.id, opIdx)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">{opcion}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {!resultado ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Evaluando...' : 'Enviar respuestas'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setResultado(null);
                  setSeleccionadas({});
                }}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 rounded-lg transition"
              >
                Reintentar cuestionario
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default QuizPage;