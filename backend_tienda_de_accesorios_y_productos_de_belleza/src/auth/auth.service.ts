import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmpleadosService } from 'src/empleados/empleados.service';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private empleadoService: EmpleadosService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { usuario, clave } = authLoginDto;

    const empleadoOk = await this.empleadoService.validate(usuario, clave);

    const payload = { sub: empleadoOk.id };
    const access_token = await this.getAccessToken(payload);

    return { ...empleadoOk, access_token };
  }

  async getAccessToken(payload: JwtPayload) {
    type StringValue = `${number}s`;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN ?? 'default_secret',
      expiresIn: process.env.JWT_TOKEN_EXPIRATION as StringValue,
    });

    return accessToken;
  }

  async verifyPayload(payload: JwtPayload): Promise<Empleado> {
    let empleado: Empleado;

    try {
      empleado = await this.empleadoService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Empleado inválido: ${payload.sub}`);
    }

    return empleado;
  }
}
