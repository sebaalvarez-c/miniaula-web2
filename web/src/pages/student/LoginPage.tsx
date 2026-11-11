import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useState } from 'react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (e) {
      setApiError(e.response?.data?.error?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Bienvenido a MiniAula</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" {...register('email', { required: 'Requerido' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input type="password" {...register('password', { required: 'Requerido' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <ErrorMessage message={apiError} />
          <button type="submit" disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="text-center text-sm text-gray-500">
            ¿No tenés cuenta? <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
