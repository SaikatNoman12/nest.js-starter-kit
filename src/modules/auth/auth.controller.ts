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
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from '../user/dto/get-user.dto';
import { PaginatedDetailsInterface } from 'src/common/pagination/paginated';
// import { GetUserDto } from '../user/dto/get-user.dto';
// import { PaginatedDetailsInterface } from 'src/common/pagination/paginated';

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
}
