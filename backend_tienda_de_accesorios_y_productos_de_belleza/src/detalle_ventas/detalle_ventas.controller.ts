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
import { DetalleVentasService } from './detalle_ventas.service';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('detalle-ventas')
export class DetalleVentasController {
  constructor(private readonly detalleVentasService: DetalleVentasService) {}

  @Post()
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detalleVentasService.create(createDetalleVentaDto);
  }

  @Get()
  findAll() {
    return this.detalleVentasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleVentasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetalleVentaDto: UpdateDetalleVentaDto,
  ) {
    return this.detalleVentasService.update(+id, updateDetalleVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleVentasService.remove(+id);
  }
}
