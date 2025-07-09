import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import authConfig from 'src/modules/auth/config/auth.config';
import { LoginResponseDto } from 'src/modules/auth/dto/login-response.dto';

@Injectable()
export class RemoveToken implements NestInterceptor {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((value) => {
        if (value.success) {
          res.cookie(this.authConfiguration.authTokenCookieName, '', {
            httpOnly: true,
          });
          return {
            success: true,
            message: value.message,
            status: value.status,
            refresh: value?.refresh,
          } as LoginResponseDto;
        } else {
          return value;
        }
      }),
      //  error in parameter
      catchError(() => throwError(() => new BadGatewayException())),
    );
  }
}
