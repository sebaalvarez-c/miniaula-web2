import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntas, submitIntento } from '../../services/lecciones.service';

export const QuizPage: React.FC = () => {
  const { cursoId, leccionId } = useParams<{ cursoId: string; leccionId: string }>();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!leccionId) return;
    getPreguntas(leccionId)
      .then(setPreguntas)
      .catch((err: any) => setError(err.response?.data?.error?.message || 'Error al cargar preguntas'))
      .finally(() => setLoading(false));
  }, [leccionId]);

  const handleSelect = (preguntaId: string, opcionIndex: number) => {
    if (resultado) return;
    setSeleccionadas((prev) => ({ ...prev, [preguntaId]: opcionIndex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leccionId) return;
    const respuestas = preguntas.map((p) => seleccionadas[p.id]);
    if (respuestas.some((r) => r === undefined)) {
      setError('Respondé todas las preguntas antes de enviar.');
      return;
    }
    setError(''); setSubmitting(true);
    try {
      const res = await submitIntento(leccionId, respuestas as number[]);
      setResultado(res);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al enviar el cuestionario');
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-4 border-brand-100 dark:border-brand-900/30 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-primary mb-6 transition-colors">
        ← Volver
      </button>

      <div className="bg-card rounded-2xl border border-theme overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div className="bg-[#1c1a16] px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <h1 className="text-2xl font-extrabold text-white">Cuestionario</h1>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {resultado && (
            <div className={`mb-6 p-5 rounded-xl border-2 ${
              resultado.aprobado
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{resultado.aprobado ? '🎉' : '📚'}</span>
                <div>
                  <p className="font-bold text-xl text-primary">{resultado.nota}%</p>
                  <p className="text-sm text-muted">Mejor nota: {resultado.mejorNota}% · Intento {resultado.intentos} de 3</p>
                </div>
              </div>
              <p className="text-sm text-primary">
                {resultado.aprobado
                  ? '¡Aprobado! Excelente trabajo.'
                  : `No alcanzaste el ${resultado.notaMinima}%.${resultado.intentosRestantes > 0 ? ` Te quedan ${resultado.intentosRestantes} intento${resultado.intentosRestantes > 1 ? 's' : ''}.` : ' Agotaste los intentos.'}`}
              </p>
            </div>
          )}

          {preguntas.length === 0 ? (
            <p className="text-muted text-center py-8">Esta lección no tiene preguntas aún.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {preguntas.map((pregunta, idx) => (
                <div key={pregunta.id} className="bg-page rounded-xl border border-theme p-5">
                  <p className="font-semibold text-primary mb-4">
                    <span className="gradient-text">{idx + 1}.</span> {pregunta.enunciado}
                  </p>
                  <div className="space-y-2">
                    {pregunta.opciones.map((opcion, opIdx) => {
                      const checked = seleccionadas[pregunta.id] === opIdx;
                      return (
                        <label
                          key={opIdx}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            checked
                              ? 'border-brand-500 bg-brand-light dark:bg-brand-900/30 text-primary'
                              : 'border-theme bg-surface text-muted hover:border-brand-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pregunta-${pregunta.id}`}
                            checked={checked}
                            disabled={!!resultado}
                            onChange={() => handleSelect(pregunta.id, opIdx)}
                            className="accent-brand-500"
                          />
                          <span className="text-sm">{opcion}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!resultado ? (
                <button type="submit" disabled={submitting}
                  className="w-full gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:shadow-glow transition-all disabled:opacity-50">
                  {submitting ? 'Evaluando...' : 'Enviar respuestas'}
                </button>
              ) : (
                <button type="button" onClick={() => { setResultado(null); setSeleccionadas({}); }}
                  className="w-full bg-surface border-2 border-theme text-primary font-semibold py-3 rounded-xl hover:border-brand-400 transition-all">
                  Reintentar cuestionario
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
