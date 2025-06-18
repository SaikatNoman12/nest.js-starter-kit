import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistException } from 'src/errors/user-already-exist.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import {
  PaginatedDetailsInterface,
  PaginatedInterface,
} from 'src/common/pagination/paginated';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationProvider: PaginationProvider<User>,
  ) {}

  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedInterface<User>> {
    try {
      const response = this.paginationProvider.paginateQuery(
        paginationDto,
        'user',
        this.userRepository,
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new RequestTimeoutException(
          'An error occurred. Please try again.',
          {
            description: `Couldn't connect to the database! Error: ${error.message}`,
          },
        );
      } else {
        throw new RequestTimeoutException(
          'An unknown error occurred. Please try again.',
          {
            description: "Couldn't connect to the database!",
          },
        );
      }
    }
  }

  public async findUser(
    email: string,
  ): Promise<PaginatedDetailsInterface<User>> {
    const response = this.paginationProvider.paginateDetailsQuery(
      'user',
      this.userRepository,
      { email },
    );

    return response;
  }

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
      message: 'User created successfully!',
      data: newUser,
    };
  }
}
