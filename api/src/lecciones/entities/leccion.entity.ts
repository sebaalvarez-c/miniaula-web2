import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Pregunta } from '../../cuestionarios/entities/pregunta.entity';

@Entity('lecciones')
@Unique(['cursoId', 'orden'])
export class Leccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ default: 'contenido' })
  tipo: string;

  @Column({ nullable: true, type: 'text' })
  contenido: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true, type: 'float' })
  notaMinima: number;

  @Column()
  orden: number;

  @Column()
  cursoId: string;

  @ManyToOne(() => Curso, (c) => c.lecciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @OneToMany(() => Pregunta, (p) => p.leccion, { cascade: true })
  preguntas: Pregunta[];
}
