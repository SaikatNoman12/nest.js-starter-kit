import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
import { HashingProvider } from 'src/modules/auth/provider/hashing.provider';
import { GetUserDto } from './dto/get-user.dto';
import { DynamicKeyInterFace } from 'src/interfaces/reuse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationProvider: PaginationProvider<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashProvider: HashingProvider,
  ) {}

  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedInterface<GetUserDto>> {
    try {
      const response = await this.paginationProvider.paginateQuery(
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
    keyValue: DynamicKeyInterFace,
  ): Promise<PaginatedDetailsInterface<User>> {
    const response = this.paginationProvider.paginateDetailsQuery(
      'user',
      this.userRepository,
      { ...keyValue },
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

    let newUser = this.userRepository.create({
      ...userDto,
      password: await this.hashProvider.hashPassword(userDto.password),
    });

    newUser = await this.userRepository.save(newUser);

    return {
      success: true,
      message: 'User created successfully!',
      data: newUser,
    };
  }
}
