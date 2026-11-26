import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { getApiError } from '../../lib/api-error';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: unknown) {
      setError(getApiError(err, 'Credenciales incorrectas'));
    }
  };

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'block',
    background: 'var(--bg-card)',
    border: `1px solid ${hasError ? '#dc2626' : 'var(--border)'}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  const emailField = register('email', {
    required: 'El email es obligatorio',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ingresá un email con formato válido',
    },
  });

  const passwordField = register('password', {
    required: 'La contraseña es obligatoria',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres',
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: '#0f0d0a' }}
      >
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          animation: 'floatA 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '60px', left: '-60px',
          width: '300px', height: '300px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          animation: 'floatB 26s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%',
          width: '180px', height: '180px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.03)',
          animation: 'floatC 16s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }} />

        <div className="relative z-10" style={{ animation: 'loginEnter 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">M</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">MiniAula</span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight"
              style={{ animation: 'loginEnter 0.9s 0.10s cubic-bezier(0.16,1,0.3,1) both' }}>
            Aprendé sin límites,<br />crecé sin parar.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed"
             style={{ animation: 'loginEnter 0.9s 0.22s cubic-bezier(0.16,1,0.3,1) both' }}>
            Accedé a cursos de programación, diseño e idiomas con instructores reales.
          </p>

          <div className="mt-10 space-y-0">
            {[
              { value: '3+',   label: 'Cursos disponibles', delay: '0.34s' },
              { value: '100%', label: 'Online y a tu ritmo',  delay: '0.44s' },
              { value: '24/7', label: 'Acceso ilimitado',     delay: '0.54s' },
            ].map(({ value, label, delay }) => (
              <div key={label} className="flex items-center gap-6 py-4 border-t border-white/[0.07]"
                   style={{ animation: `loginEnter 0.9s ${delay} cubic-bezier(0.16,1,0.3,1) both` }}>
                <span className="text-2xl font-bold text-white w-16 tabular-nums">{value}</span>
                <span className="text-white/35 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/15 text-xs"
             style={{ animation: 'loginEnter 0.9s 0.64s cubic-bezier(0.16,1,0.3,1) both' }}>
          © 2024 MiniAula
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--bg-page)' }}>
        <div className="w-full max-w-sm" style={{ animation: 'loginEnter 0.9s cubic-bezier(0.16,1,0.3,1) forwards' }}>
          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          </div>

          <div className="mb-8" style={{ animation: 'loginEnter 0.9s 0.10s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Bienvenido de vuelta
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Ingresá con tu cuenta de MiniAula
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm" style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.20)',
              color: '#dc2626',
              animation: 'loginEnter 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: '16px', animation: 'loginEnter 0.9s 0.20s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                className="login-input"
                style={getInputStyle(!!errors.email)}
                {...emailField}
                onFocus={e => {
                  e.target.style.borderColor = errors.email ? '#dc2626' : 'var(--text-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(28,26,22,0.08)';
                }}
                onBlur={e => {
                  emailField.onBlur(e);
                  e.target.style.borderColor = errors.email ? '#dc2626' : 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs" style={{ color: '#dc2626' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px', animation: 'loginEnter 0.9s 0.32s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={getInputStyle(!!errors.password)}
                {...passwordField}
                onFocus={e => {
                  e.target.style.borderColor = errors.password ? '#dc2626' : 'var(--text-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(28,26,22,0.08)';
                }}
                onBlur={e => {
                  passwordField.onBlur(e);
                  e.target.style.borderColor = errors.password ? '#dc2626' : 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs" style={{ color: '#dc2626' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div style={{ animation: 'loginEnter 0.9s 0.44s cubic-bezier(0.16,1,0.3,1) both' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? 'rgba(28,26,22,0.6)' : 'var(--accent)',
                  color: 'var(--accent-fg)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s, transform 0.15s',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => { if (!isSubmitting) (e.target as HTMLButtonElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
                onMouseDown={e => { if (!isSubmitting) (e.target as HTMLButtonElement).style.transform = 'scale(0.99)'; }}
                onMouseUp={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Ingresar'}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm" style={{
            color: 'var(--text-muted)',
            animation: 'loginEnter 0.9s 0.56s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-20px,15px) rotate(5deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(15px,-20px) rotate(-4deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(10px,10px) scale(1.05); }
        }
        @keyframes loginEnter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;