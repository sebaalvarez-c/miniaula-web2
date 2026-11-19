import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Leccion } from '../../lecciones/entities/leccion.entity';

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ type: 'jsonb' })
  opciones: string[];

  @Column({ name: 'respuesta_correcta', type: 'int' })
  respuestaCorrecta: number;

  @Column({ name: 'leccion_id' })
  leccionId: number;

  @ManyToOne(() => Leccion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leccion_id' })
  leccion: Leccion;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}