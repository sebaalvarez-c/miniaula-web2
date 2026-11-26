import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CursosModule } from './cursos/cursos.module';
import { LeccionesModule } from './lecciones/lecciones.module';
import { CuestionariosModule } from './cuestionarios/cuestionarios.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { DatabaseModule } from './database/database.module';
import { SeedService } from './database/seed.service';
import { User } from './users/entities/user.entity';
import { Curso } from './cursos/entities/curso.entity';
import { Leccion } from './lecciones/entities/leccion.entity';
import { Pregunta } from './cuestionarios/entities/pregunta.entity';
import { Inscripcion } from './inscripciones/entities/inscripcion.entity';
import { Progreso } from './inscripciones/entities/progreso.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres123'),
        database: config.get('DB_NAME', 'miniaula'),
        entities: [User, Curso, Leccion, Pregunta, Inscripcion, Progreso],
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true' || config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    UsersModule,
    AuthModule,
    CursosModule,
    LeccionesModule,
    CuestionariosModule,
    InscripcionesModule,
      DatabaseModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  })
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap() {
    await this.seedService.run();
  }
}
