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
import { UnidadesMedidaService } from './unidades_medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidad_medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad_medida.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(private readonly unidadesMedidaService: UnidadesMedidaService) {}

  @Post()
  create(@Body() createUnidadMedidaDto: CreateUnidadMedidaDto) {
    return this.unidadesMedidaService.create(createUnidadMedidaDto);
  }

  @Get()
  findAll() {
    return this.unidadesMedidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesMedidaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUnidadMedidaDto: UpdateUnidadMedidaDto,
  ) {
    return this.unidadesMedidaService.update(+id, updateUnidadMedidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesMedidaService.remove(+id);
  }
}
