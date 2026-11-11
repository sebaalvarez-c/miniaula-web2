# MiniAula

Mini LMS para Ingeniería Web 2. Permite a instructores crear cursos con lecciones y cuestionarios, y a estudiantes inscribirse y avanzar secuencialmente.

## Levantar el proyecto

```bash
cp .env.example .env        # completar las variables (ver sección de abajo)
docker compose up --build
```

Para desarrollo local sin Docker:

```bash
yarn install   # en api/ y en web/
```

| Servicio   | URL                              |
|------------|----------------------------------|
| Frontend   | http://localhost                 |
| API        | http://localhost:3000/api        |
| Swagger    | http://localhost:3000/api/docs   |

## Variables de entorno

Crear `.env` en la raíz del proyecto basándose en `.env.example`:

```
POSTGRES_DB=miniaula
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me
JWT_SECRET=change_me_to_a_long_random_string
```

> En CI o para desarrollo rápido se puede usar el archivo `.env` del repositorio con los valores por defecto. No commitear secretos reales.

## Usuarios de prueba (seed automático)

| Email                    | Contraseña | Rol        |
|--------------------------|------------|------------|
| instructor1@mini.com     | Test1234!  | Instructor |
| instructor2@mini.com     | Test1234!  | Instructor |
| student1@mini.com        | Test1234!  | Estudiante |
| student2@mini.com        | Test1234!  | Estudiante |
| student3@mini.com        | Test1234!  | Estudiante |

El seed crea 3 cursos publicados con 5 lecciones cada uno (4 de contenido + 1 cuestionario con 5 preguntas).

## Stack

| Capa       | Tecnología                                      |
|------------|-------------------------------------------------|
| Backend    | NestJS · TypeScript · TypeORM · PostgreSQL      |
| Frontend   | React + Vite · TypeScript · Tailwind CSS        |
| Auth       | JWT (Bearer) · Passport                         |
| Infra      | Docker Compose · nginx (reverse proxy)          |

## Arquitectura

```
api/
  src/
    auth/          # Registro, login, JWT
    users/         # Perfil
    cursos/        # CRUD de cursos, catálogo, panel
    instructor/    # Rutas exclusivas para instructores
    lecciones/     # CRUD de lecciones, acceso secuencial
    preguntas/     # CRUD de preguntas
    cuestionarios/ # Lógica de cuestionarios
    inscripciones/ # Inscripción a cursos
    progreso/      # Marcar completada, rendir cuestionario
    common/        # Guards, decoradores, pipes compartidos
    middleware/    # Interceptores y filtros de errores
    config/        # Configuración de TypeORM y Swagger
    database/      # Seed
web/
  src/
    context/       # AuthContext (sesión persistente)
    services/      # Capa axios (nunca fetch directo en componentes)
    hooks/         # useAuth
    components/    # UI reutilizable
    pages/
      student/     # Login, Registro, Catálogo, Lección, Quiz, Mis cursos, Perfil
      instructor/  # Mis cursos, Editor de curso, Editor de lección, Panel
```

## Reglas de negocio

| Código | Descripción                                                                      |
|--------|----------------------------------------------------------------------------------|
| RN-01  | Acceso secuencial a lecciones verificado en el servidor                          |
| RN-02  | Calificación del cuestionario calculada en el servidor; respuestas nunca al cliente |
| RN-03  | Máximo 3 intentos por cuestionario; se guarda la mejor nota                      |
| RN-04  | No se puede inscribir dos veces al mismo curso (409)                             |
| RN-05  | No se puede publicar un curso sin lecciones (422)                                |
| RN-06  | Un curso con inscritos no se puede eliminar, solo archivar (409)                 |
| RN-07  | El instructor solo modifica sus propios recursos (403)                           |
| RN-08  | El estudiante solo ve su propio progreso                                         |
