# MiniAula

Mini LMS para Ingeniería Web 2. Permite a instructores crear cursos con lecciones y cuestionarios, y a estudiantes inscribirse y avanzar secuencialmente.

## Levantar el proyecto

```bash
cp .env.example .env        # completar las variables (ver sección de abajo)
docker compose up --build
```

Para desarrollo local sin Docker:

```bash
cp api/.env.example api/.env   # completar DB_PASSWORD y JWT_SECRET
yarn install   # en api/ y en web/ (también funciona pnpm install)
```

Con pnpm, `api/pnpm-workspace.yaml` habilita el build nativo de `bcrypt` y deshabilita el script de telemetría de `@scarf/scarf`.

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
DB_SYNCHRONIZE=true
```

`JWT_SECRET` y `POSTGRES_PASSWORD` son obligatorios con Docker Compose. `DB_SYNCHRONIZE` debe ser `false` en producción (requiere migraciones); el seed y el desarrollo local usan `true`.

> En CI o para desarrollo rápido se puede usar el archivo `.env` del repositorio con los valores por defecto. No commitear secretos reales.

## Usuarios de prueba (seed automático)

| Email                    | Contraseña | Rol        |
|--------------------------|------------|------------|
| instructor1@mini.com     | Test1234!  | Instructor |
| instructor2@mini.com     | Test1234!  | Instructor |
| student1@mini.com        | Test1234!  | Estudiante |
| student2@mini.com        | Test1234!  | Estudiante |
| student3@mini.com        | Test1234!  | Estudiante |

El seed crea 3 cursos publicados con 5 lecciones cada uno (4 de contenido + 1 cuestionario con 5 preguntas). El registro público siempre crea cuentas de estudiante; las cuentas de instructor provienen del seed.

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
    users/         # Perfil (/users/me)
    cursos/        # CRUD de cursos, catálogo, panel
    lecciones/     # CRUD y reorden de lecciones, acceso secuencial
    cuestionarios/ # Preguntas y lógica de cuestionarios
    inscripciones/ # Inscripción y progreso
    common/        # Guards, decoradores, filtros y tipos compartidos
    config/        # Secreto JWT
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
| RN-09  | Reordenar lecciones exige propiedad, lista completa y es transaccional           |
