import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
// Días siguientes:
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { CursosModule } from './cursos/cursos.module';
// import { LeccionesModule } from './lecciones/lecciones.module';
// import { CuestionariosModule } from './cuestionarios/cuestionarios.module';
// import { InscripcionesModule } from './inscripciones/inscripciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    // AuthModule,          // Día 3
    // UsersModule,         // Día 3
    // CursosModule,        // Día 4
    // LeccionesModule,     // Día 5
    // CuestionariosModule, // Día 5
    // InscripcionesModule, // Día 6
  ],
})
export class AppModule {}