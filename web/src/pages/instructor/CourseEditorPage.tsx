import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getMisCursos, updateCurso, updateEstado, createCurso } from '../../services/cursos.service.js';
import { createLeccion, deleteLeccion, reorderLecciones } from '../../services/lecciones.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

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
    reset({ titulo: found.titulo, descripcion: found.descripcion, categoria: found.categoria, nivel: found.nivel });
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
          <button onClick={() => navigate('/instructor/cursos')} className="text-gray-400 hover:text-gray-600">←</button>
          <h1 className="text-xl font-bold">{curso.titulo}</h1>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{curso.estado}</span>
        </div>
        <div className="flex gap-2">
          {curso.estado === 'borrador' && <button onClick={() => handlePublish('publicado')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Publicar</button>}
          {curso.estado === 'publicado' && <button onClick={() => handlePublish('archivado')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600">Archivar</button>}
        </div>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-gray-700">Información del curso</h2>
          {[
            { name: 'titulo', label: 'Título' },
            { name: 'descripcion', label: 'Descripción', textarea: true },
          ].map(({ name, label, textarea }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              {textarea ? (
                <textarea {...register(name)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              ) : (
                <input {...register(name)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select {...register('categoria')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Programación', 'Diseño', 'Idiomas'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nivel</label>
              <select {...register('nivel')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Básico', 'Intermedio', 'Avanzado'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={!isDirty || saving} className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-gray-700">Lecciones ({curso.lecciones?.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => handleAddLesson('contenido')} disabled={addingLesson} className="text-xs border border-gray-300 px-2 py-1 rounded hover:border-blue-400 disabled:opacity-50">+ Contenido</button>
              <button onClick={() => handleAddLesson('cuestionario')} disabled={addingLesson} className="text-xs border border-orange-300 text-orange-600 px-2 py-1 rounded hover:bg-orange-50 disabled:opacity-50">+ Quiz</button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {curso.lecciones?.map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-gray-200">
                <span className="text-gray-300 text-sm">≡</span>
                <span className="text-sm flex-1">{l.orden}. {l.titulo}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${l.tipo === 'cuestionario' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                  {l.tipo === 'cuestionario' ? 'Quiz' : 'Contenido'}
                </span>
                <button onClick={() => navigate(`/instructor/lecciones/${l.id}`)} className="text-xs text-blue-600 hover:underline">Editar</button>
                <button onClick={() => handleDeleteLesson(l.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
              </div>
            ))}
            {curso.lecciones?.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay lecciones todavía</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
