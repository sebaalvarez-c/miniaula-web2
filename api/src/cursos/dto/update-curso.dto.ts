import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCursoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  nivel?: string;
}

export class UpdateEstadoDto {
  @IsIn(['borrador', 'publicado', 'archivado'])
  estado: string;
}
