import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNumber, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsDefined({ message: 'El id de venta es obligatorio' })
  @IsInt({ message: 'El id de venta debe ser un número entero' })
  readonly idVenta: number;

  @ApiProperty()
  @IsDefined({ message: 'El id de producto es obligatorio' })
  @IsInt({ message: 'El id de producto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  readonly cantidad: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { message: 'El descuento debe ser un número' })
  @Min(0, { message: 'El descuento no puede ser negativo' })
  readonly descuento: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @Min(0, { message: 'El subtotal no puede ser negativo' })
  readonly subtotal: number;
}
