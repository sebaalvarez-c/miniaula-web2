import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useState } from 'react';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ nombre: string; email: string; password: string; rol: string }>({ defaultValues: { nombre: '', email: '', password: '', rol: 'estudiante' } });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await registerUser(data);
      navigate('/login');
    } catch (e) {
      setApiError(e.response?.data?.error?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Crear cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          {[
            { name: 'nombre', label: 'Nombre', type: 'text', rules: { required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
            { name: 'email', label: 'Email', type: 'email', rules: { required: 'Requerido' } },
            { name: 'password', label: 'Contraseña', type: 'password', rules: { required: 'Requerido', minLength: { value: 8, message: 'Mínimo 8 caracteres' } } },
          ].map(({ name, label, type, rules }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input type={type} {...register(name as 'nombre' | 'email' | 'password', rules)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select {...register('rol')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="estudiante">Estudiante</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <ErrorMessage message={apiError} />
          <button type="submit" disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          <p className="text-center text-sm text-gray-500">
            ¿Ya tenés cuenta? <Link to="/login" className="text-blue-600 hover:underline">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
