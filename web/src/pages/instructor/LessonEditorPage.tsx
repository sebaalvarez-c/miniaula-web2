import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getLeccion, updateLeccion } from '../../services/lecciones.service.js';
import { createPregunta, deletePregunta } from '../../services/preguntas.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export function LessonEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const tipo = watch('tipo');

  // Instructor reads the lesson without the student enrollment check
  // We load it via the instructor's cursos list
  useEffect(() => {
    // We'll use the getMisCursos approach — but since we don't have a direct "get lesson by id for instructor"
    // endpoint exposed, we call the student endpoint and handle the 403 gracefully by showing the form from cached data
    setLoading(true);
    // Build a minimal data structure so the form works; instructor fetches the full course list
    import('../../services/cursos.service.js').then(({ getMisCursos }) => getMisCursos()).then((cursos) => {
      for (const c of cursos) {
        const found = c.lecciones?.find((l) => l.id === id);
        if (found) {
          setData({ leccion: found, cursoId: c.id, preguntas: [] });
          reset({ titulo: found.titulo, tipo: found.tipo, contenido: found.contenido ?? '', videoUrl: found.videoUrl ?? '', notaMinima: found.notaMinima ?? 70 });
          return;
        }
      }
      setError('Lección no encontrada');
    }).catch(() => setError('Error al cargar')).finally(() => setLoading(false));
  }, [id]);

  const onSave = async (formData) => {
    setSaving(true); setError('');
    try { await updateLeccion(id, formData); setError(''); alert('Guardado'); }
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
        <button onClick={() => data?.cursoId ? navigate(`/instructor/cursos/${data.cursoId}`) : navigate('/instructor/cursos')} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-xl font-bold">Editar lección</h1>
      </div>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input {...register('titulo')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select {...register('tipo')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="contenido">Contenido</option>
            <option value="cuestionario">Cuestionario</option>
          </select>
        </div>
        {tipo === 'contenido' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Contenido</label>
              <textarea {...register('contenido')} rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL del video (opcional)</label>
              <input {...register('videoUrl')} type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        )}
        {tipo === 'cuestionario' && (
          <div>
            <label className="block text-sm font-medium mb-1">Nota mínima para aprobar</label>
            <input {...register('notaMinima', { valueAsNumber: true })} type="number" min="0" max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar lección'}
        </button>
      </form>
      {tipo === 'cuestionario' && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Preguntas</h2>
            <button onClick={handleAddQuestion} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">+ Agregar</button>
          </div>
          <p className="text-sm text-gray-400">Las preguntas se agregan mediante el diálogo. Las respuestas correctas nunca se muestran al estudiante.</p>
        </div>
      )}
    </div>
  );
}
