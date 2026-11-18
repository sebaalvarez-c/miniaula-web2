import { IsArray, IsInt } from 'class-validator';

export class SubmitIntentoDto {
  @IsArray()
  @IsInt({ each: true })
  respuestas: number[];
}
