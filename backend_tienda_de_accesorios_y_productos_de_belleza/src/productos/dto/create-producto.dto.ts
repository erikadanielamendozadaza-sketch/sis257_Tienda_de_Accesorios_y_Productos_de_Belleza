import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsDefined({ message: 'El id de la categoría es obligatorio' })
  @IsInt({ message: 'El id de la categoría debe ser un número entero' })
  readonly idCategoria: number;

  @ApiProperty()
  @IsDefined({ message: 'El id de la unidad de medida es obligatorio' })
  @IsInt({ message: 'El id de la unidad de medida debe ser un número entero' })
  readonly idUnidadMedida: number;

  @ApiProperty()
  @IsDefined({ message: 'El id del proveedor es obligatorio' })
  @IsInt({ message: 'El id del proveedor debe ser un número entero' })
  readonly idProveedor: number;

  @ApiProperty()
  @IsDefined({ message: 'El id de la marca es obligatorio' })
  @IsInt({ message: 'El id de la marca debe ser un número entero' })
  readonly idMarca: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(10, { message: 'El código no puede tener mas de 10 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly codigo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede tener mas de 100 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La imagen no puede tener mas de 255 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly imagen?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  readonly stock: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de vencimiento debe ser una fecha válida' },
  )
  readonly fechaVencimiento: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad mínima debe ser un número entero' })
  @Min(0, { message: 'La cantidad mínima no puede ser negativa' })
  readonly cantidadMinimaStock: number;
}
