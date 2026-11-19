import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';

@Entity('lecciones')
export class Leccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 180 })
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'int', default: 1 })
  orden: number;

  @Column({ name: 'duracion_minutos', type: 'int', default: 10 })
  duracionMinutos: number;

  @Column({ name: 'video_url', nullable: true })
  videoUrl?: string;

  @Column({ name: 'curso_id' })
  cursoId: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}