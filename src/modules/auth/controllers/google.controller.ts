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

@Controller('google')
@ApiTags('Google Auth')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiOperation({
    summary: 'Google login.',
    description: 'Initiates the Google login process via OAuth.',
  })
  @AllowAnonymous()
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    console.log('Nomaan');
  }

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
