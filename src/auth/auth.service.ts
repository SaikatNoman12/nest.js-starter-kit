import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { ActiveUserType } from 'src/interfaces/active-user-type.interface';
import { HashingProvider } from './provider/hashing.provider';

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

  public async login(loginDto: AuthDto) {
    const user = (await this.userService.findUser(loginDto.email)).data;

    if (!user?.password) {
      throw new UnauthorizedException('User does not have a password set.');
    }

    const isValidPassword = await this.hashProvider.comparePassword(
      loginDto.password,
      user?.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect Password!');
    }

    const allTokens = await this.getToken(user);

    return {
      ...allTokens,
      message: 'User logged in successfully.',
    };
  }

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

  public async getToken(user: User) {
    const accessPayload: Partial<ActiveUserType> = {
      email: user.email,
    };

    const accessTokenPromise = this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfiguration.expiresIn,
      accessPayload,
    );

    const refreshTokenPromise = this.signToken(
      user.id,
      this.authConfiguration.refreshTokenExpiresIn,
    );

    const [access, refresh] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      access,
      refresh,
    };
  }

  public async signUp(userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
