import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('progreso')
@Unique(['inscripcionId', 'leccionId'])
export class Progreso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inscripcionId: string;

  @Column()
  leccionId: string;

  @Column({ default: false })
  completada: boolean;

  @Column({ default: 0 })
  intentos: number;

  @Column({ nullable: true, type: 'float' })
  mejorNota: number;

  @ManyToOne(() => Inscripcion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inscripcionId' })
  inscripcion: Inscripcion;
}
