import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';

@Entity('inscripciones')
@Unique(['estudianteId', 'cursoId'])
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  estudianteId: string;

  @Column()
  cursoId: string;

  @ManyToOne(() => Curso, { eager: false })
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @CreateDateColumn()
  inscritoEn: Date;
}
