import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getMisCursos, updateCurso, updateEstado } from '../../services/cursos.service.js';
import { createLeccion, deleteLeccion } from '../../services/lecciones.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

const ESTADO_BADGE = 'text-xs bg-surface border border-theme text-muted px-2 py-0.5 rounded-full';

const inputCls = 'w-full bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all';

export function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm();

  const load = async () => {
    const cursos = await getMisCursos();
    const found = cursos.find((c) => c.id === id);
    if (!found) { navigate('/instructor/cursos'); return; }
    setCurso(found);
    reset({
      titulo: found.titulo === 'Nuevo curso' ? '' : found.titulo,
      descripcion: found.descripcion,
      categoria: found.categoria,
      nivel: found.nivel,
    });
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const onSave = async (data) => {
    setSaving(true); setError('');
    try { await updateCurso(id, data); await load(); }
    catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handlePublish = async (estado) => {
    setError('');
    try { await updateEstado(id, estado); await load(); }
    catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
  };

  const handleAddLesson = async (tipo) => {
    setAddingLesson(true);
    try {
      await createLeccion(id, { titulo: tipo === 'cuestionario' ? 'Nuevo cuestionario' : 'Nueva lección', tipo, notaMinima: tipo === 'cuestionario' ? 70 : undefined });
      await load();
    } catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
    finally { setAddingLesson(false); }
  };

  const handleDeleteLesson = async (leccionId) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    try { await deleteLeccion(leccionId); await load(); }
    catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/instructor/cursos')} className="text-muted hover:text-primary transition-colors">←</button>
          <h1 className="text-xl font-bold text-primary">{curso.titulo === 'Nuevo curso' ? 'Nuevo curso' : curso.titulo}</h1>
          <span className={ESTADO_BADGE}>{curso.estado}</span>
        </div>
        <div className="flex gap-2">
          {curso.estado === 'borrador' && <button onClick={() => handlePublish('publicado')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">Publicar</button>}
          {curso.estado === 'publicado' && <button onClick={() => handlePublish('archivado')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">Archivar</button>}
        </div>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit(onSave)} className="bg-card rounded-xl border border-theme p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted">Información del curso</h2>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Título</label>
            <input
              {...register('titulo')}
              placeholder="Nuevo curso"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Categoría</label>
              <select {...register('categoria')} className={inputCls}>
                {['Programación', 'Diseño', 'Idiomas'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Nivel</label>
              <select {...register('nivel')} className={inputCls}>
                {['Básico', 'Intermedio', 'Avanzado'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={!isDirty || saving}
            className="gradient-brand py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        <div className="bg-card rounded-xl border border-theme p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-muted">Lecciones ({curso.lecciones?.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => handleAddLesson('contenido')} disabled={addingLesson}
                className="text-xs border border-theme text-muted px-2 py-1 rounded hover:text-primary hover:border-brand-400 disabled:opacity-50 transition-colors">
                + Contenido
              </button>
              <button onClick={() => handleAddLesson('cuestionario')} disabled={addingLesson}
                className="text-xs border border-orange-300 dark:border-orange-800 text-orange-600 dark:text-orange-400 px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 transition-colors">
                + Quiz
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {curso.lecciones?.map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg border border-theme hover:bg-surface transition-colors">
                <span className="text-subtle text-sm">≡</span>
                <span className="text-sm flex-1 text-primary">{l.orden}. {l.titulo}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  l.tipo === 'cuestionario'
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                }`}>
                  {l.tipo === 'cuestionario' ? 'Quiz' : 'Contenido'}
                </span>
                <button onClick={() => navigate(`/instructor/lecciones/${l.id}`)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">Editar</button>
                <button onClick={() => handleDeleteLesson(l.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">✕</button>
              </div>
            ))}
            {curso.lecciones?.length === 0 && <p className="text-sm text-muted text-center py-4">No hay lecciones todavía</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
