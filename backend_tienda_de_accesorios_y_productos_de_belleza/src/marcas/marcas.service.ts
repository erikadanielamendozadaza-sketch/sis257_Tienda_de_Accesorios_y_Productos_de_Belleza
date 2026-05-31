import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    let marca = await this.marcaRepository.findOneBy({
      nombre: createMarcaDto.nombre,
    });

    if (marca) {
      throw new ConflictException('La marca ya existe');
    }

    marca = new Marca();
    Object.assign(marca, createMarcaDto);

    return this.marcaRepository.save(marca);
  }

  async findAll(): Promise<Marca[]> {
    return this.marcaRepository.find({
      select: {
        id: true,
        nombre: true,
        productos: { id: true, nombre: true },
      },
      relations: {
        productos: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { id },
      relations: {
        productos: true,
      },
    });

    if (!marca) {
      throw new NotFoundException('La marca no existe');
    }

    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);

    Object.assign(marca, updateMarcaDto);

    return this.marcaRepository.save(marca);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);
    return this.marcaRepository.softRemove(marca);
  }
}
