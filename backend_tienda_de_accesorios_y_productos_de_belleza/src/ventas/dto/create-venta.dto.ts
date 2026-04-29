import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsInt, Min } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty()
  @IsDefined({ message: 'El id del cliente es obligatorio' })
  @IsInt({ message: 'El id del cliente debe ser un número entero' })
  readonly idCliente: number;

  @ApiProperty()
  @IsDefined({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  readonly fecha: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad mínima debe ser un número entero' })
  @Min(0, { message: 'La cantidad mínima no puede ser negativa' })
  readonly total: number;
}
