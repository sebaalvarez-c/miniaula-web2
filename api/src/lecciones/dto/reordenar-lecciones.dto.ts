import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class ReordenarLeccionesDto {
  @IsArray({ message: 'El campo orden debe ser un arreglo de IDs' })
  @ArrayMinSize(1, { message: 'Debe enviar al menos una lección para reordenar' })
  @IsUUID('all', { each: true, message: 'Cada ID debe ser un UUID válido' })
  orden: string[];
}
