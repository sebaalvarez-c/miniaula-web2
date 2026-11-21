import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RespuestaItemDto {
  @IsInt()
  preguntaId: number;

  @IsInt()
  @Min(0)
  opcionSeleccionada: number;
}

export class SubmitIntentoDto {
  @IsInt()
  leccionId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe responder al menos una pregunta' })
  @ValidateNested({ each: true })
  @Type(() => RespuestaItemDto)
  respuestas: RespuestaItemDto[];
}