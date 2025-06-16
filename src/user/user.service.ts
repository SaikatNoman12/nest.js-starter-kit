import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistException } from 'src/errors/user-already-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(userDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (user) {
      throw new UserAlreadyExistException('this email', user.email);
    }

    let newUser = this.userRepository.create(userDto);

    newUser = await this.userRepository.save(newUser);

    return {
      success: true,
      data: newUser,
    };
  }
}
