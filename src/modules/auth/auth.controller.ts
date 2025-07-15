import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { SetToken } from 'src/shared/interceptors';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { RemoveToken } from 'src/shared/interceptors/remove-token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('refresh-token')
  @AllowAnonymous()
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('logout')
  @UseInterceptors(RemoveToken)
  async logout(@ActiveUser('sub') userId: number) {
    return await this.authService.logout(userId);
  }
}
