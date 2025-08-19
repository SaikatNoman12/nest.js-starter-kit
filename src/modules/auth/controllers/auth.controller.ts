import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AllowAnonymous } from '../decorators/allow-anonymous.decorator';
import { SetToken } from 'src/shared/interceptors';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { RemoveToken } from 'src/shared/interceptors/remove-token.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedDetailsInterface } from 'src/common/pagination/paginated';
import { GoogleAuthGuard } from 'src/shared/guards/google-auth.guard';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/auth.dto';
import { GetUserDto } from 'src/modules/user/dto/get-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowAnonymous()
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto): Promise<LoginResponseDto> {
    return this.authService.login(authDto);
  }

  @Get('check-login')
  @ApiResponseDto(GetUserDto, false)
  @HttpCode(HttpStatus.OK)
  checkLogin(
    @ActiveUser('sub') userId: number,
  ): Promise<PaginatedDetailsInterface<GetUserDto>> {
    return this.authService.getUserInformation(userId);
  }

  @Post('refresh-token')
  @AllowAnonymous()
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('logout')
  @UseInterceptors(RemoveToken)
  async logout(@ActiveUser('sub') userId: number): Promise<LoginResponseDto> {
    return await this.authService.logout(userId);
  }

  // google login
  @Get('google/login')
  @ApiOperation({
    summary: 'Google login.',
    description: 'Initiates the Google login process via OAuth.',
  })
  @AllowAnonymous()
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google login callback.',
    description:
      'Handles the callback from Google login and processes user data.',
  })
  @AllowAnonymous()
  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  googleLoginCallback(@Req() req) {
    try {
      const { email, provider, password } = req.user;

      return this.authService.login({
        email,
        provider,
        password,
      });
    } catch (error) {
      this.authService.handleLoginError(error);
    }
  }
}
