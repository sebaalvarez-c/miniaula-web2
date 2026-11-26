import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'student' | 'instructor'>('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(nombre, email, password, rol);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', display: 'block',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--text-primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(28,26,22,0.08)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Left panel — same as login */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: '#0f0d0a' }}
      >
        {/* Animated background shapes */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          animation: 'floatA 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '60px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          animation: 'floatB 26s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%',
          width: '180px', height: '180px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.03)',
          animation: 'floatC 16s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px', opacity: 0.5,
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
            Tu viaje de aprendizaje<br />empieza acá.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed"
             style={{ animation: 'loginEnter 0.9s 0.22s cubic-bezier(0.16,1,0.3,1) both' }}>
            Unite a la comunidad. Elegí tu camino — estudiante o instructor.
          </p>

          <div className="mt-10 space-y-0">
            {[
              { value: 'Free',  label: 'Registro sin costo',      delay: '0.34s' },
              { value: '3+',   label: 'Cursos disponibles',       delay: '0.44s' },
              { value: '24/7', label: 'Acceso desde cualquier lugar', delay: '0.54s' },
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
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          </div>

          <div className="mb-7" style={{ animation: 'loginEnter 0.9s 0.10s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Crear cuenta</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Completá tus datos para empezar</p>
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ animation: 'loginEnter 0.9s 0.10s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Nombre completo</label>
              <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
                     placeholder="Tu nombre" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={{ animation: 'loginEnter 0.9s 0.20s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="tu@correo.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={{ animation: 'loginEnter 0.9s 0.30s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Contraseña</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="Mínimo 6 caracteres" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div style={{ animation: 'loginEnter 0.9s 0.40s cubic-bezier(0.16,1,0.3,1) both' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Tipo de cuenta</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(['student', 'instructor'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRol(r)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: rol === r ? '2px solid var(--text-primary)' : '1px solid var(--border)',
                      background: rol === r ? 'var(--accent)' : 'var(--bg-card)',
                      color: rol === r ? 'var(--accent-fg)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {r === 'student' ? '🎓 Estudiante' : '👨‍🏫 Instructor'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ animation: 'loginEnter 0.9s 0.50s cubic-bezier(0.16,1,0.3,1) both' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: submitting ? 'rgba(28,26,22,0.6)' : 'var(--accent)',
                  color: 'var(--accent-fg)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s, transform 0.15s',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => { if (!submitting) (e.target as HTMLButtonElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
                onMouseDown={e => { if (!submitting) (e.target as HTMLButtonElement).style.transform = 'scale(0.99)'; }}
                onMouseUp={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                {submitting ? 'Registrando...' : 'Crear cuenta gratis'}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm" style={{
            color: 'var(--text-muted)',
            animation: 'loginEnter 0.9s 0.60s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Iniciá sesión
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
      `}</style>
    </div>
  );
};

export default RegisterPage;
