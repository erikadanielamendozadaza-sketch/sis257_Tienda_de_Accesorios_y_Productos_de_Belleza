import { Venta } from 'src/ventas/entities/venta.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50})
  primerApellido: string;

  @Column('varchar', { length: 50 })
  segundoApellido: string;

  @Column('varchar', { length: 10 })
  cedulaIdentidad: string;

  @Column('varchar', { length: 50 })
  usuario: string;

  @Column('varchar', { length: 100 })
  clave: string;

  @Column('varchar', { length: 10 })
  telefono: string;

       @CreateDateColumn({ name: 'fecha_creacion' })
        fechaCreacion: Date;
      
        @UpdateDateColumn({ name: 'fecha_modificacion' })
        fechaModicicaion: Date;
      
        @DeleteDateColumn({ name: 'fecha_eliminacion' })
        fechaEliminacion: Date;

        @OneToMany(() => Venta, (venta) => venta.empleado)
        ventas: Venta[]

        
}
