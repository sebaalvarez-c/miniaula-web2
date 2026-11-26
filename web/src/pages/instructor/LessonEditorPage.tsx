import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getLeccion, updateLeccion } from '../../services/lecciones.service.js';
import { createPregunta } from '../../services/preguntas.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

const inputCls = 'w-full bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all';

export function LessonEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const tipo = watch('tipo');

  useEffect(() => {
    setLoading(true);
    import('../../services/cursos.service.js').then(({ getMisCursos }) => getMisCursos()).then((cursos) => {
      for (const c of cursos) {
        const found = c.lecciones?.find((l) => l.id === id);
        if (found) {
          setData({ leccion: found, cursoId: c.id });
          reset({ titulo: found.titulo, tipo: found.tipo, contenido: found.contenido ?? '', videoUrl: found.videoUrl ?? '', notaMinima: found.notaMinima ?? 70 });
          return;
        }
      }
      setError('Lección no encontrada');
    }).catch(() => setError('Error al cargar')).finally(() => setLoading(false));
  }, [id]);

  const onSave = async (formData) => {
    setSaving(true); setError('');
    try { await updateLeccion(id, formData); }
    catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleAddQuestion = async () => {
    const enunciado = prompt('Enunciado de la pregunta:');
    if (!enunciado) return;
    const optsRaw = prompt('Opciones separadas por | (ej: Opción A|Opción B|Opción C)');
    if (!optsRaw) return;
    const opciones = optsRaw.split('|').map((s) => s.trim()).filter(Boolean);
    if (opciones.length < 2) { alert('Mínimo 2 opciones'); return; }
    const idx = parseInt(prompt(`Índice de la opción correcta (0-${opciones.length - 1}):`), 10);
    if (isNaN(idx) || idx < 0 || idx >= opciones.length) { alert('Índice inválido'); return; }
    try {
      await createPregunta(id, { enunciado, opciones, indiceCorrecto: idx });
      alert('Pregunta agregada');
    } catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => data?.cursoId ? navigate(`/instructor/cursos/${data.cursoId}`) : navigate('/instructor/cursos')}
          className="text-muted hover:text-primary transition-colors">←</button>
        <h1 className="text-xl font-bold text-primary">Editar lección</h1>
      </div>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <form onSubmit={handleSubmit(onSave)} className="bg-card rounded-xl border border-theme p-5 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Título</label>
          <input {...register('titulo')} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Tipo</label>
          <select {...register('tipo')} className={inputCls}>
            <option value="contenido">Contenido</option>
            <option value="cuestionario">Cuestionario</option>
          </select>
        </div>
        {tipo === 'contenido' && (
          <>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Contenido</label>
              <textarea {...register('contenido')} rows={6} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">URL del video (opcional)</label>
              <input {...register('videoUrl')} type="url" className={inputCls} />
            </div>
          </>
        )}
        {tipo === 'cuestionario' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Nota mínima para aprobar</label>
            <input {...register('notaMinima', { valueAsNumber: true })} type="number" min="0" max="100" className={inputCls} />
          </div>
        )}
        <button type="submit" disabled={saving}
          className="gradient-brand py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
          {saving ? 'Guardando...' : 'Guardar lección'}
        </button>
      </form>
      {tipo === 'cuestionario' && (
        <div className="mt-6 bg-card rounded-xl border border-theme p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm text-primary">Preguntas</h2>
            <button onClick={handleAddQuestion}
              className="text-sm gradient-brand px-3 py-1 rounded-lg hover:opacity-90 transition-all">
              + Agregar
            </button>
          </div>
          <p className="text-sm text-muted">Las preguntas se agregan mediante el diálogo. Las respuestas correctas nunca se muestran al estudiante.</p>
        </div>
      )}
    </div>
  );
}
