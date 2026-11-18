import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CursosModule } from './cursos/cursos.module';
import { LeccionesModule } from './lecciones/lecciones.module';
import { CuestionariosModule } from './cuestionarios/cuestionarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10,  // máximo 10 peticiones por minuto
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CursosModule,
    LeccionesModule,
    CuestionariosModule,
  ],
})
export class AppModule {}