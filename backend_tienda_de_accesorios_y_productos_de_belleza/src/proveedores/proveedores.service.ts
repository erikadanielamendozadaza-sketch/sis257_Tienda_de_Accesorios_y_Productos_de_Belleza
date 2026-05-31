import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    let proveedor = await this.proveedorRepository.findOneBy({
      nombreEmpresa: createProveedorDto.nombreEmpresa,
    });
    if (proveedor) {
      throw new ConflictException('El nombre de la empresa ya está registrado');
    }
    proveedor = new Proveedor();
    Object.assign(proveedor, createProveedorDto);
    return this.proveedorRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find({
      select: {
        id: true,
        nombreEmpresa: true,
        telefono: true,
        direccion: true,
        email: true,
        productos: { id: true, nombre: true },
      },
      relations: { productos: true },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
      relations: {
        productos: true,
      },
    });
    if (!proveedor) {
      throw new ConflictException('El proveedor no existe');
    }
    return proveedor;
  }
  async update(
    id: number,
    updateProveedorDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    if (updateProveedorDto.nombreEmpresa) {
      const existe = await this.proveedorRepository.findOneBy({
        nombreEmpresa: updateProveedorDto.nombreEmpresa,
      });
      if (existe && existe.id !== id) {
        throw new ConflictException(
          'Ya existe un proveedor con ese nombre de empresa',
        );
      }
    }
    Object.assign(proveedor, updateProveedorDto);
    return this.proveedorRepository.save(proveedor);
  }

  async remove(id: number) {
    const proveedor = await this.findOne(id);
    return this.proveedorRepository.remove(proveedor);
  }
}
