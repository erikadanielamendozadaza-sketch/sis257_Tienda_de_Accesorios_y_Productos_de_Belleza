import { Categoria } from 'src/categorias/entities/categoria.entity';
import { DetalleVenta } from 'src/detalle_ventas/entities/detalle_venta.entity';
import { Marca } from 'src/marcas/entities/marca.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { UnidadMedida } from 'src/unidades_medida/entities/unidad_medida.entity';
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

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_categoria' })
  idCategoria: number;

  @Column('integer', { name: 'id_unidad_medida' })
  idUnidadMedida: number;

  @Column('integer', { name: 'id_proveedor' })
  idProveedor: number;

  @Column('integer', { name: 'id_marca' })
  idMarca: number;

  @Column('varchar', { length: 10 })
  codigo: string;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', {length: 255, nullable: true})
  foto?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('int')
  stock: number;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @Column('int')
  cantidadMinimaStock: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModicicaion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @ManyToOne(() => UnidadMedida, (unidadMedida) => unidadMedida.productos)
  @JoinColumn({ name: 'id_unidad_medida' })
  unidadMedida: UnidadMedida;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detalles: DetalleVenta[];

  @ManyToOne(() => Marca, (marca) => marca.productos)
  @JoinColumn({ name: 'id_marca' })
  marca: Marca;
}
