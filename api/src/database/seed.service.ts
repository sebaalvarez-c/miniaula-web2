import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.runSeed();
  }

  async runSeed() {
    try {
      const hasUsersTable = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'users'
        );
      `);

      if (!hasUsersTable[0]?.exists) {
        this.logger.log('Tablas aún no inicializadas. Saltando seed inicial.');
        return;
      }

      const countResult = await this.dataSource.query('SELECT COUNT(*) FROM users');
      if (parseInt(countResult[0].count, 10) > 0) {
        this.logger.log('Seed ya ejecutado previamente.');
        return;
      }

      const passwordHash = await bcrypt.hash('123456', 10);

      await this.dataSource.query(
        `INSERT INTO users (nombre, email, password, rol) VALUES 
        ('Instructor Demo', 'instructor@miniaula.com', $1, 'instructor'),
        ('Estudiante Demo', 'estudiante@miniaula.com', $1, 'student')`,
        [passwordHash],
      );

      this.logger.log('Datos iniciales (seed) insertados correctamente.');
    } catch (error) {
      this.logger.warn('Seed pendiente de entidades completas.');
    }
  }
}