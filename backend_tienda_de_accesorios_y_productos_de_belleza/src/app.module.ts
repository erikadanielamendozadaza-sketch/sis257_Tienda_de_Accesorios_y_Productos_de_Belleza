import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './categorias/categorias.module';
import { UnidadesMedidaModule } from './unidades_medida/unidades_medida.module';
import { ClientesModule } from './clientes/clientes.module';
import { VentasModule } from './ventas/ventas.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { EmpleadosModule } from './empleados/empleados.module';

import { MarcasModule } from './marcas/marcas.module';
import { AuthModule } from './auth/auth.module';
import { DetallesVentaModule } from './detalle_ventas/detalles_venta.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '*/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductosModule,
    CategoriasModule,
    UnidadesMedidaModule,
    ClientesModule,
    VentasModule,
    ProveedoresModule,
    EmpleadosModule,
    DetallesVentaModule,
    MarcasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
