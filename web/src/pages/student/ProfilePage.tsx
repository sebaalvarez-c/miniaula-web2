import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth.js';
import { updateMe } from '../../services/auth.service.js';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useState } from 'react';
import { getApiError } from '../../lib/api-error';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [apiError, setApiError] = useState('');
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ nombre: string; email: string }>({ defaultValues: { nombre: user?.nombre, email: user?.email } });

  const onSubmit = async (data: { nombre: string; email: string }) => {
    setApiError(''); setSaved(false);
    try {
      const updated = await updateMe(data as Record<string, unknown>);
      updateUser(updated);
      setSaved(true);
    } catch (e) {
      setApiError(getApiError(e, 'Error al actualizar'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6 text-primary">Mi perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-xl border border-theme p-6 flex flex-col gap-4 shadow-card dark:shadow-card-dark">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted">Nombre</label>
          <input {...register('nombre', { required: 'Requerido' })}
            className="w-full bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted">Email</label>
          <input type="email" {...register('email', { required: 'Requerido' })}
            className="w-full bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-primary placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="bg-surface border border-theme rounded-lg px-3 py-2 text-sm text-muted">
          Rol: <span className="capitalize font-medium text-primary">{user?.rol}</span>
        </div>
        {saved && <p className="text-emerald-600 dark:text-emerald-400 text-sm">Perfil actualizado.</p>}
        <ErrorMessage message={apiError} />
        <button type="submit" disabled={isSubmitting}
          className="gradient-brand py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
