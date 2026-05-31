import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}
  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    let empleado = await this.empleadoRepository.findOneBy({
      cedulaIdentidad: createEmpleadoDto.cedulaIdentidad,
    });
    if (empleado) {
      throw new ConflictException(
        'Ya existe un empleado con esa cedula de identidad',
      );
    }
    empleado = new Empleado();
    Object.assign(empleado, createEmpleadoDto);
    empleado.clave = process.env.DEFAULT_PASSWORD ?? '';
    await empleado.hashPassword();
    return this.empleadoRepository.save(empleado);
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadoRepository.find({
      select: {
        id: true,
        nombre: true,
        primerApellido: true,
        segundoApellido: true,
        cedulaIdentidad: true,
        usuario: true,
        telefono: true,
        ventas: { id: true, fecha: true, total: true },
      },
      relations: {
        ventas: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: {
        ventas: true,
      },
    });
    if (!empleado) {
      throw new NotFoundException('El empleado no existe');
    }
    return empleado;
  }

  async update(
    id: number,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<Empleado> {
    const empleado = await this.findOne(id);

    if (updateEmpleadoDto.cedulaIdentidad) {
      const existe = await this.empleadoRepository.findOneBy({
        cedulaIdentidad: updateEmpleadoDto.cedulaIdentidad,
      });
      if (existe && existe.id !== id) {
        throw new ConflictException(
          'Ya existe un empleado con esa cedulad de Identidad',
        );
      }
    }

    if (updateEmpleadoDto.usuario) {
      const existe = await this.empleadoRepository.findOneBy({
        usuario: updateEmpleadoDto.usuario,
      });

      if (existe && existe.id !== id) {
        throw new ConflictException('Ya existe un empleado con ese usuario');
      }
    }

    Object.assign(empleado, updateEmpleadoDto);
    return this.empleadoRepository.save(empleado);
  }

  async remove(id: number) {
    const empleado = await this.findOne(id);
    return this.empleadoRepository.softRemove(empleado);
  }

  async validate(usuario: string, clave: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { usuario },
      select: [
        'id',
        'nombre',
        'primerApellido',
        'segundoApellido',
        'cedulaIdentidad',
        'usuario',
        'clave',
        'telefono',
      ],
    });

    if (!empleado) {
      throw new NotFoundException('Empleado inexistente');
    }

    if (!(await empleado.validatePassword(clave))) {
      throw new UnauthorizedException('Clave incorrecta');
    }

    empleado.clave = '';
    return empleado;
  }
}
