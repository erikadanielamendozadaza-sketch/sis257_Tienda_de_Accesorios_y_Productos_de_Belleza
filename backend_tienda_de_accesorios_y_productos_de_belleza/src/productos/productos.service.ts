import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    let producto = await this.productoRepository.findOneBy({
      idCategoria: createProductoDto.idCategoria,
      codigo: createProductoDto.codigo,
    });

    if (producto) {
      throw new ConflictException('El producto ya existe con ese código');
    }

    if (createProductoDto.stock < createProductoDto.cantidadMinimaStock) {
      throw new ConflictException(
        'El stock no puede ser menor que la cantidad mínima de stock',
      );
    }

    producto = new Producto();
    Object.assign(producto, createProductoDto);
    return this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        precioUnitario: true,
        stock: true,
        fechaVencimiento: true,
        cantidadMinimaStock: true,
        categoria: { id: true, nombre: true },
        unidadMedida: { id: true, descripcion: true },
      },
      relations: { categoria: true, unidadMedida: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: { categoria: true, unidadMedida: true },
    });
    if (!producto) {
      throw new NotFoundException('El producto no existe');
    }
    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOne(id);

    const stock = updateProductoDto.stock ?? producto.stock;
    const min =
      updateProductoDto.cantidadMinimaStock ?? producto.cantidadMinimaStock;

    if (stock < min) {
      throw new ConflictException(
        'El stock no puede ser menor que la cantidad mínima de stock',
      );
    }

    Object.assign(producto, updateProductoDto);

    return this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productoRepository.softRemove(producto);
  }
}
