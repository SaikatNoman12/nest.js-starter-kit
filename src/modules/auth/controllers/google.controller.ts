import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '../decorators/allow-anonymous.decorator';
import { GoogleAuthGuard } from 'src/shared/guards/google-auth.guard';
import { SetToken } from 'src/shared/interceptors';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { AuthService } from '../auth.service';

@Controller('auth/google')
@ApiTags('Google Auth')
export class GoogleController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @ApiOperation({
    summary: 'Google login.',
    description: 'Initiates the Google login process via OAuth.',
  })
  @AllowAnonymous()
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('callback')
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
  async googleLoginCallback(@Req() req) {
    try {
      const { email, provider, password } = req.user;

      const response = await this.authService.login({
        email,
        provider,
        password,
      });

      return response;
    } catch (error) {
      this.authService.handleLoginError(error);
    }
  }
}
