import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El nombre no puede tener más de 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @IsString({ message: 'El primer apellido debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El primer apellido no puede tener más de 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly primerApellido: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El segundo apellido es obligatorio' })
  @IsString({ message: 'El el segundo apellido debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El segundo apellido no puede tener más de 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly segundoApellido: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cedula de identidad es obligatorio' })
  @IsString({ message: 'La cedula de identidad debe ser una cadena de texto' })
  @MaxLength(10, {
    message: 'La cedula de identidad no puede tener más de 10 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly cedulaIdentidad: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El usuario no puede tener más de 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly usuario: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(10, {
    message: 'El teléfono no puede tener más de 10 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly telefono: string;
}
