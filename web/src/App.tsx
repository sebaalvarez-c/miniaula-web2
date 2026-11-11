import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { Navbar } from './components/Navbar';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/student/LoginPage';
import { RegisterPage } from './pages/student/RegisterPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { CatalogPage } from './pages/student/CatalogPage';
import { CourseDetailPage } from './pages/student/CourseDetailPage';
import { LessonPage } from './pages/student/LessonPage';
import { QuizPage } from './pages/student/QuizPage';
import { MyCursosPage } from './pages/student/MyCursosPage';
import { CourseLearnPage } from './pages/student/CourseLearnPage';

import { InstructorMisCursosPage } from './pages/instructor/MisCursosPage';
import { CourseEditorPage } from './pages/instructor/CourseEditorPage';
import { LessonEditorPage } from './pages/instructor/LessonEditorPage';
import { PanelPage } from './pages/instructor/PanelPage';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/catalogo" replace />;
  if (user.rol === 'instructor') return <Navigate to="/instructor/cursos" replace />;
  return <Navigate to="/catalogo" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/cursos/:id" element={<CourseDetailPage />} />

        {/* Protected (any authenticated user) */}
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Student only */}
        <Route path="/mis-cursos" element={<RoleRoute role="estudiante"><MyCursosPage /></RoleRoute>} />
        <Route path="/cursos/:cursoId/aprender" element={<RoleRoute role="estudiante"><CourseLearnPage /></RoleRoute>} />
        <Route path="/cursos/:cursoId/lecciones/:leccionId" element={<RoleRoute role="estudiante"><LessonPage /></RoleRoute>} />
        <Route path="/cursos/:cursoId/lecciones/:leccionId/quiz" element={<RoleRoute role="estudiante"><QuizPage /></RoleRoute>} />

        {/* Instructor only */}
        <Route path="/instructor/cursos" element={<RoleRoute role="instructor"><InstructorMisCursosPage /></RoleRoute>} />
        <Route path="/instructor/cursos/:id" element={<RoleRoute role="instructor"><CourseEditorPage /></RoleRoute>} />
        <Route path="/instructor/lecciones/:id" element={<RoleRoute role="instructor"><LessonEditorPage /></RoleRoute>} />
        <Route path="/instructor/panel" element={<RoleRoute role="instructor"><PanelPage /></RoleRoute>} />
        <Route path="/instructor/panel/:id" element={<RoleRoute role="instructor"><PanelPage /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
