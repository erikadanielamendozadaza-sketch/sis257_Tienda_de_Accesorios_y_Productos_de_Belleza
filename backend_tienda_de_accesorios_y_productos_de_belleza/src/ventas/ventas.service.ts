import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}
  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    if (createVentaDto.total < 0) {
      throw new ConflictException('El total no puede ser negativo');
    }

    let venta = new Venta();
    Object.assign(venta, createVentaDto);
    venta.fecha = new Date();
    return this.ventaRepository.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      select: {
        id: true,
        fecha: true,
        total: true,
        cliente: {
          id: true,
          razonSocial: true,
          cedulaIdentidad: true,
        },
      },
      relations: { cliente: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    if (!venta) {
      throw new NotFoundException('La venta no existe');
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);

    Object.assign(venta, updateVentaDto);

    return this.ventaRepository.save(venta);
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    return this.ventaRepository.softRemove(venta);
  }
}
