import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    let cliente = await this.clienteRepository.findOneBy({
      cedulaIdentidad: createClienteDto.cedulaIdentidad,
    });

    if (cliente) {
      throw new ConflictException(
        'Ya existe un cliente con esa cédula de identidad',
      );
    }

    cliente = new Cliente();
    Object.assign(cliente, createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({
      select: {
        id: true,
        razonSocial: true,
        cedulaIdentidad: true,
      },
      order: { razonSocial: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });

    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }

    return cliente;
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);
    if (updateClienteDto.cedulaIdentidad) {
      const existe = await this.clienteRepository.findOneBy({
        cedulaIdentidad: updateClienteDto.cedulaIdentidad,
      });

      if (existe && existe.id !== id) {
        throw new ConflictException('Ya existe un cliente con esa cédula');
      }
    }

    if (updateClienteDto.razonSocial) {
      const existe = await this.clienteRepository.findOneBy({
        razonSocial: updateClienteDto.razonSocial,
      });

      if (existe && existe.id !== id) {
        throw new ConflictException(
          'Ya existe un cliente con esa razón social',
        );
      }
    }

    Object.assign(cliente, updateClienteDto);

    return this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    return this.clienteRepository.softRemove(cliente);
  }
}
