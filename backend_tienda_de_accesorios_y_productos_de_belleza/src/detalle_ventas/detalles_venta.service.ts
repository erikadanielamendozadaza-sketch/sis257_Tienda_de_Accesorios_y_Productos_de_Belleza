import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetallesVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(
    createDetalleVentaDto: CreateDetalleVentaDto,
  ): Promise<DetalleVenta> {
    let detalleVenta = await this.detalleVentaRepository.findOneBy({
      idVenta: createDetalleVentaDto.idVenta,
      idProducto: createDetalleVentaDto.idProducto,
    });

    if (detalleVenta) {
      throw new ConflictException(
        'Ya existe un detalle de venta para esa venta y producto',
      );
    }

    if (createDetalleVentaDto.cantidad <= 0) {
      throw new ConflictException('La cantidad debe ser mayor a 0');
    }

    if (createDetalleVentaDto.precioUnitario < 0) {
      throw new ConflictException('El precio no puede ser negativo');
    }

    if (createDetalleVentaDto.descuento < 0) {
      throw new ConflictException('El descuento no puede ser negativo');
    }

    const subtotal =
      createDetalleVentaDto.cantidad * createDetalleVentaDto.precioUnitario -
      createDetalleVentaDto.descuento;

    if (subtotal < 0) {
      throw new ConflictException('El subtotal no puede ser negativo');
    }

    detalleVenta = new DetalleVenta();
    Object.assign(detalleVenta, createDetalleVentaDto);
    detalleVenta.subtotal = subtotal;

    return this.detalleVentaRepository.save(detalleVenta);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({
      select: {
        id: true,
        cantidad: true,
        precioUnitario: true,
        descuento: true,
        subtotal: true,
        venta: { id: true, fecha: true },
        producto: { id: true, nombre: true },
      },
      relations: {
        venta: true,
        producto: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalleVenta = await this.detalleVentaRepository.findOne({
      where: { id },
      relations: {
        venta: true,
        producto: true,
      },
    });

    if (!detalleVenta) {
      throw new NotFoundException('El detalle de venta no existe');
    }

    return detalleVenta;
  }

  async findByVenta(idVenta: number) {
    return this.detalleVentaRepository.find({
      where: { idVenta },
      relations: ['producto'],
    });
  }

  async update(
    id: number,
    updateDetalleVentaDto: UpdateDetalleVentaDto,
  ): Promise<DetalleVenta> {
    const detalleVenta = await this.findOne(id);

    const cantidad = updateDetalleVentaDto.cantidad ?? detalleVenta.cantidad;
    const precio =
      updateDetalleVentaDto.precioUnitario ?? detalleVenta.precioUnitario;
    const descuento = updateDetalleVentaDto.descuento ?? detalleVenta.descuento;

    if (cantidad <= 0) {
      throw new ConflictException('La cantidad debe ser mayor a 0');
    }

    if (precio < 0) {
      throw new ConflictException('El precio no puede ser negativo');
    }

    if (descuento < 0) {
      throw new ConflictException('El descuento no puede ser negativo');
    }

    const subtotal = cantidad * precio - descuento;
    if (subtotal < 0) {
      throw new ConflictException('El subtotal no puede ser negativo');
    }
    Object.assign(detalleVenta, updateDetalleVentaDto);
    detalleVenta.subtotal = subtotal;
    return this.detalleVentaRepository.save(detalleVenta);
  }

  async remove(id: number) {
    const detalleVenta = await this.findOne(id);
    return this.detalleVentaRepository.softRemove(detalleVenta);
  }
}
