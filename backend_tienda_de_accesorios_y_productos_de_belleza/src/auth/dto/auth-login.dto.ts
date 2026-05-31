import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El usuario no puede tener más de 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  usuario: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Clave/Contraseña no debe ser vacío' })
  @IsString({ message: 'El campo Clave/Contraseña debe ser de tipo cadena' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  clave: string;
}
