import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Leccion } from '../../lecciones/entities/leccion.entity';

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enunciado: string;

  @Column('simple-array')
  opciones: string[];

  @Column()
  indiceCorrecto: number;

  @Column()
  leccionId: string;

  @ManyToOne(() => Leccion, (l) => l.preguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leccionId' })
  leccion: Leccion;
}
