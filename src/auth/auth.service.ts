import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  public async login(loginDto: AuthDto) {
    const user = this.userService.findUser(loginDto.email);
    return user;
  }

  public async signUp(userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
