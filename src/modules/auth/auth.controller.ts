import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { SetToken } from 'src/shared/interceptors';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @UseInterceptors(SetToken)
  @ApiResponseDto(LoginResponseDto, false)
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
