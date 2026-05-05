import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El nombre de la empresa no puede tener más de 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombreEmpresa: string;

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


  @ApiProperty()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(200, {
    message: 'La dirección no puede tener más de 200 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly direccion: string;

    @ApiProperty()
  @IsNotEmpty({ message: 'El email es obligatoria' })
  @IsString({ message: 'El email debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El email no puede tener más de 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly email: string;
}
