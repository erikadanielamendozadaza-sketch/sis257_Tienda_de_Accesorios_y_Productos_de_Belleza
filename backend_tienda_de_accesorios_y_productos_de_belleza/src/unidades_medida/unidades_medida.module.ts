import { Module } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades_medida.service';
import { UnidadesMedidaController } from './unidades_medida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadMedida } from './entities/unidad_medida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadMedida])],
  controllers: [UnidadesMedidaController],
  providers: [UnidadesMedidaService],
})
export class UnidadesMedidaModule {}
