import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMisCursos, getResumen } from '../../services/cursos.service.js';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { getApiError } from '../../lib/api-error';
import type { Curso } from '../../types';

interface ResumenLeccion {
  id: string;
  orden: number;
  titulo: string;
  estudiantesLlegaron: number;
}

interface ResumenData {
  inscritos: number;
  progresoPromedio: number;
  notaPromedio: number | null;
  lecciones: ResumenLeccion[];
}

export function PanelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selected, setSelected] = useState<string>(id ?? '');
  const [resumen, setResumen] = useState<ResumenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMisCursos().then(setCursos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setError(''); setResumen(null);
    getResumen(selected)
      .then(setResumen)
      .catch((e) => setError(getApiError(e, 'Error')));
  }, [selected]);

  const maxReached = resumen ? Math.max(...resumen.lecciones.map((l) => l.estudiantesLlegaron), 1) : 1;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageHeader title="Panel" onBack={() => navigate('/instructor/cursos')} />

      <div className="mb-6">
        <label className="block text-sm font-medium text-primary mb-1">Seleccioná un curso</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}
          className="bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all">
          <option value="">-- Elegí un curso --</option>
          {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
        </select>
      </div>

      {error && <ErrorMessage message={error} />}
      {!selected && <EmptyState title="Elegí un curso para ver el panel" />}

      {resumen && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Inscritos', value: resumen.inscritos },
              { label: 'Progreso promedio', value: `${resumen.progresoPromedio}%` },
              { label: 'Nota promedio', value: resumen.notaPromedio ?? '—' },
              { label: 'Completaron', value: '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card rounded-xl border border-theme p-4 text-center">
                <p className="text-xs text-muted mb-1">{label}</p>
                <p className="text-2xl font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-theme p-5">
            <h2 className="font-semibold text-sm text-primary mb-4">Estudiantes que llegaron a cada lección</h2>
            <div className="flex flex-col gap-3">
              {resumen.lecciones.map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted w-48 truncate">{l.orden}. {l.titulo}</span>
                  <div className="flex-1 bg-surface rounded-full h-3 overflow-hidden border border-theme">
                    <div className="gradient-brand h-3 rounded-full transition-all" style={{ width: `${(l.estudiantesLlegaron / maxReached) * 100}%` }} />
                  </div>
                  <span className="text-sm text-muted w-8 text-right">{l.estudiantesLlegaron}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
