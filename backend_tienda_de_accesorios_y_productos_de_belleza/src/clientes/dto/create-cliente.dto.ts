import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'La razón social no puede tener más de 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly razonSocial: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cédula de identidad es obligatoria' })
  @IsString({ message: 'La cédula de identidad debe ser una cadena de texto' })
  @MaxLength(10, {
    message: 'La cédula de identidad no puede tener más de 10 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly cedulaIdentidad: string;
}
