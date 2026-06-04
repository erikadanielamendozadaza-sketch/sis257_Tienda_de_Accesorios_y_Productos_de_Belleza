import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DetallesVentaService } from './detalles_venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('detalles-venta')
export class DetallesVentaController {
  constructor(private readonly detallesVentaService: DetallesVentaService) {}

  @Post()
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detallesVentaService.create(createDetalleVentaDto);
  }

  @Get()
  findAll() {
    return this.detallesVentaService.findAll();
  }

  @Get('venta/:idVenta')
  findByVenta(@Param('idVenta') idVenta: string) {
    return this.detallesVentaService.findByVenta(+idVenta);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesVentaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetalleVentaDto: UpdateDetalleVentaDto,
  ) {
    return this.detallesVentaService.update(+id, updateDetalleVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesVentaService.remove(+id);
  }
}
