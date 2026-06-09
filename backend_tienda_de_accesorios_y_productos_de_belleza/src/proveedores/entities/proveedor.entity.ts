import { Producto } from 'src/productos/entities/producto.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100, name: 'nombre_empresa' })
  nombreEmpresa: string;

  @Column('varchar', { length: 10 })
  telefono: string;

  @Column('varchar', { length: 200 })
  direccion: string;

  @Column('varchar', { length: 100 })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModicicaion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Producto, (producto) => producto.proveedor)
  productos: Producto[];
}
