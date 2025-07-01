import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all')
  findAll(
    @Query() paginationDto: PaginationDto,
    @ActiveUser('sub') userId: number,
  ) {
    console.log('userId comes form active user', userId);
    return this.userService.findAll(paginationDto);
  }

  @Post('create')
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
