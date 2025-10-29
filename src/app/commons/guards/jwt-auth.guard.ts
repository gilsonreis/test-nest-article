/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const header = req.headers?.authorization ?? req.headers?.Authorization;
    if (!header || typeof header !== 'string') {
      throw new UnauthorizedException('Token ausente');
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de autorização inválido');
    }

    try {
      const secret = this.config.get<string>('JWT_SECRET') ?? 'dev-secret';
      const payload = this.jwt.verify(token, { secret });
      // Disponibiliza o usuário no request
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
