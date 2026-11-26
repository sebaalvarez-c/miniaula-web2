import { useState, useEffect } from 'react';
import { getProgresoCurso } from '../services/cursos.service.js';
import type { ProgresoData } from '../types';

export function useProgreso(cursoId: string) {
  const [data, setData] = useState<ProgresoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cursoId) return;
    setLoading(true);
    getProgresoCurso(cursoId)
      .then(setData)
      .catch((e) => setError(e.response?.data?.error?.message || 'Error loading progress'))
      .finally(() => setLoading(false));
  }, [cursoId]);

  const refresh = () => {
    setLoading(true);
    getProgresoCurso(cursoId)
      .then(setData)
      .catch((e) => setError(e.response?.data?.error?.message || 'Error'))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refresh };
}
