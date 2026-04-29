import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUnidadMedidaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(30, {
    message: 'La descripción no puede tener más de 30 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly descripcion: string;
}
