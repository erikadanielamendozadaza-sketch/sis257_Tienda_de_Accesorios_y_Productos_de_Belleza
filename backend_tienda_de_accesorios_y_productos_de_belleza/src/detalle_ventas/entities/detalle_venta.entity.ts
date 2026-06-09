import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('detalles_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_venta' })
  idVenta: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('integer')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  descuento: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModicicaion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detalles)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}
