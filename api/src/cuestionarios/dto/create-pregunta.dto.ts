import { IsArray, IsInt, IsString, Min, ArrayMinSize } from 'class-validator';

export class CreatePreguntaDto {
  @IsString()
  enunciado: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  opciones: string[];

  @IsInt()
  @Min(0)
  indiceCorrecto: number;
}
