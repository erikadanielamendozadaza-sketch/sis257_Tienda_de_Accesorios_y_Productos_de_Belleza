import { compare, genSalt, hash } from 'bcryptjs';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50 })
  primerApellido: string;

  @Column('varchar', { length: 50 })
  segundoApellido: string;

  @Column('varchar', { length: 10 })
  cedulaIdentidad: string;

  @Column('varchar', { length: 50 })
  usuario: string;

  @Column('varchar', { length: 100, select: false })
  clave: string;

  @Column('varchar', { length: 10 })
  telefono: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModicicaion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  async hashPassword() {
    const salt = await genSalt();
    this.clave = await hash(this.clave, salt);
  }
  async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.clave);
  }

  @OneToMany(() => Venta, (venta) => venta.empleado)
  ventas: Venta[];
}
