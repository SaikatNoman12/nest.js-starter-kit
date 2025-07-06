import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/constants/constants';
import { Request } from 'express';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1] as string;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.authConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException({
        message: 'Invalid or expired token!',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }

    return true;
  }
}
