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
import { UpdateUserDto } from './dto/update-user.dto';

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
      const response = await this.paginationProvider.paginateQuery({
        paginationQueryDto: paginationDto,
        message: 'user',
        repository: this.userRepository,
        select: ['id', 'name', 'email'],
      });

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
    isAll?: boolean,
  ): Promise<PaginatedDetailsInterface<User>> {
    const response = await this.paginationProvider.paginateDetailsQuery({
      message: 'user found',
      repository: this.userRepository,
      where: { ...keyValue },
      relations: null,
      select: isAll
        ? ['id', 'name', 'email', 'password']
        : ['id', 'name', 'email'],
    });

    return response;
  }

  public async create(
    userDto: CreateUserDto,
  ): Promise<PaginatedDetailsInterface<User>> {
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

    const response = await this.paginationProvider.paginateDetailsQuery({
      message: 'User created',
      repository: this.userRepository,
      where: { id: newUser.id },
      relations: null,
      select: ['id', 'name', 'email'],
      isCreate: true,
    });

    return response;
  }

  public async update(
    userUpdateDto: UpdateUserDto,
    id: number,
  ): Promise<PaginatedDetailsInterface<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new UserAlreadyExistException('this id', id);
      }

      if (userUpdateDto.name) {
        user.name = userUpdateDto.name;
      }

      if (userUpdateDto.email && userUpdateDto.email !== user.email) {
        const userCheck = await this.userRepository.findOne({
          where: { email: userUpdateDto.email },
        });
        if (userCheck) {
          {
            return {
              status: 409,
              message: 'This user with email already exists!',
              success: false,
            };
          }
        }

        user.email = userUpdateDto.email;
      }

      if (userUpdateDto.password) {
        user.password = await this.hashProvider.hashPassword(
          userUpdateDto.password,
        );
      }

      await this.userRepository.save(user);

      const response = await this.paginationProvider.paginateDetailsQuery({
        message: 'User updated',
        repository: this.userRepository,
        where: { id },
        select: ['id', 'name', 'email'],
        isCreate: true,
      });

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
}
