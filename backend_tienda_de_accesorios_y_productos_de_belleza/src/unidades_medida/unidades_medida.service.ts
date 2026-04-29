import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnidadMedidaDto } from './dto/create-unidad_medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad_medida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadMedida } from './entities/unidad_medida.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnidadesMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly unidadMedidaRepository: Repository<UnidadMedida>,
  ) {}
  async create(
    createUnidadMedidaDto: CreateUnidadMedidaDto,
  ): Promise<UnidadMedida> {
    let unidad = await this.unidadMedidaRepository.findOneBy({
      descripcion: createUnidadMedidaDto.descripcion,
    });

    if (unidad) {
      throw new ConflictException('La unidad de medida ya existe');
    }

    unidad = new UnidadMedida();
    Object.assign(unidad, createUnidadMedidaDto);

    return this.unidadMedidaRepository.save(unidad);
  }

  async findAll(): Promise<UnidadMedida[]> {
    return this.unidadMedidaRepository.find({
      select: {
        id: true,
        descripcion: true,
      },
      order: { descripcion: 'ASC' },
    });
  }

  async findOne(id: number): Promise<UnidadMedida> {
    const unidad = await this.unidadMedidaRepository.findOneBy({ id });

    if (!unidad) {
      throw new NotFoundException('La unidad de medida no existe');
    }

    return unidad;
  }

  async update(
    id: number,
    updateUnidadMedidaDto: UpdateUnidadMedidaDto,
  ): Promise<UnidadMedida> {
    const unidad = await this.findOne(id);

    Object.assign(unidad, updateUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidad);
  }

  async remove(id: number) {
    const unidad = await this.findOne(id);
    return this.unidadMedidaRepository.softRemove(unidad);
  }
}
