import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/modules/user/user.entity';
import { ActiveUserType } from 'src/interfaces/active-user-type.interface';
import { HashingProvider } from './provider/hashing.provider';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { QueryFailedError } from 'typeorm';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  public async login(loginDto: AuthDto): Promise<LoginResponseDto> {
    try {
      const user = (
        await this.userService.findUser({ email: loginDto.email }, true)
      ).data;

      if (!user) {
        return {
          success: false,
          message: 'Email is not valid.',
          status: 400,
        } as LoginResponseDto;
      }

      const isValidPassword = await this.hashProvider.comparePassword(
        loginDto.password,
        user?.password,
      );

      if (!isValidPassword) {
        return {
          success: false,
          message: 'Password is not matched.',
          status: 400,
        } as LoginResponseDto;
      }
      const allTokens = await this.getToken(user);

      const setRefresh = await this.userService.updateRefresh(
        user.id,
        allTokens?.refresh as string,
      );

      if (setRefresh) {
        return {
          ...allTokens,
          success: true,
          status: 200,
          message: 'User logged in successfully.',
        } as LoginResponseDto;
      } else {
        return {
          success: false,
          message: 'Something wrong. Please try again.',
          status: 400,
        } as LoginResponseDto;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new RequestTimeoutException(
          'An error occurred. Please try again.',
          {
            description: `Couldn't connect to the database. Error: ${error.message}.`,
          },
        );
      } else {
        throw new RequestTimeoutException(
          'An unknown error occurred. Please try again.',
          {
            description: "Couldn't connect to the database.",
          },
        );
      }
    }
  }

  public async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    const userData = (
      await this.userService.findUser(
        { refresh: refreshTokenDto.refresh },
        true,
      )
    ).data;

    try {
      if (!userData) {
        return {
          success: false,
          status: 400,
          message: 'Refresh token invalid.',
        } as LoginResponseDto;
      }

      const payload = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refresh,
        {
          secret: this.authConfiguration.secret,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token dto.');
      }

      const user = (await this.userService.findUser({ id: userId })).data;

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const allTokens = await this.getToken(user, false);

      return {
        ...allTokens,
        refresh: refreshTokenDto.refresh,
        success: true,
        status: 200,
        message: 'User access token refresh successfully.',
      } as LoginResponseDto;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError('Duplicate Key Error', [], error);
        }
        throw new QueryFailedError(error.message, [], error);
      } else if (error instanceof UnauthorizedException) {
        if (userData) await this.userService.updateRefresh(userData.id, null);
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  public async logout(id: number): Promise<LoginResponseDto> {
    try {
      if (id) await this.userService.updateRefresh(id, null);
      return {
        success: true,
        message: `Successfully logout`,
        status: 200,
      } as LoginResponseDto;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError('Duplicate Key Error', [], error);
        }
        throw new QueryFailedError(error.message, [], error);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * This is for generate token and get token.
   * signToken() for generate token.
   * getToken() for get token.
   */
  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  public async getToken(
    user: User,
    isRefreshToken: boolean = true,
  ): Promise<LoginResponseDto> {
    const accessPayload: Partial<ActiveUserType> = {
      email: user.email,
    };

    const accessTokenPromise = this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfiguration.expiresIn,
      accessPayload,
    );

    const refreshTokenPromise =
      isRefreshToken &&
      this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn);

    const [access, refresh] = await Promise.all([
      accessTokenPromise,
      isRefreshToken ? refreshTokenPromise : Promise.resolve(null),
    ]);

    return {
      access,
      ...(isRefreshToken && { refresh }),
    } as LoginResponseDto;
  }
}
