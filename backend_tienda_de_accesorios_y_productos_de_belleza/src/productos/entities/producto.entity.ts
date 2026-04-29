import { Categoria } from 'src/categorias/entities/categoria.entity';
import { UnidadMedida } from 'src/unidades_medida/entities/unidad_medida.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column('varchar', { length: 10 })
  codigo: string;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('int')
  stock: number;

  @Column('date')
  fechaVencimiento: Date;

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
}
