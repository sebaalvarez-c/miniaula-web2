import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Leccion } from '../../lecciones/entities/leccion.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ nullable: true })
  nivel: string;

  @Column({ default: 'borrador' })
  estado: string;

  @Column()
  instructorId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @OneToMany(() => Leccion, (l) => l.curso, { cascade: false })
  lecciones: Leccion[];

  @CreateDateColumn()
  creadoEn: Date;
}
