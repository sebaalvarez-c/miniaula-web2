import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth.js';
import { updateMe } from '../../services/auth.service.js';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useState } from 'react';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [apiError, setApiError] = useState('');
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ nombre: string; email: string }>({ defaultValues: { nombre: user?.nombre, email: user?.email } });

  const onSubmit = async (data) => {
    setApiError(''); setSaved(false);
    try {
      const updated = await updateMe(data);
      updateUser(updated);
      setSaved(true);
    } catch (e) {
      setApiError(e.response?.data?.error?.message || 'Error al actualizar');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Mi perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input {...register('nombre', { required: 'Requerido' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register('email', { required: 'Requerido' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500">
          Rol: <span className="capitalize font-medium text-gray-700">{user?.rol}</span>
        </div>
        {saved && <p className="text-green-600 text-sm">Perfil actualizado.</p>}
        <ErrorMessage message={apiError} />
        <button type="submit" disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
