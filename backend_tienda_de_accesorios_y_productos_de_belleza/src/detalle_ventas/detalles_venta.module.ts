import { Module } from '@nestjs/common';
import { DetallesVentaService } from './detalles_venta.service';
import { DetallesVentaController } from './detalles_venta.controller';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [DetallesVentaController],
  providers: [DetallesVentaService],
})
export class DetallesVentaModule {}
