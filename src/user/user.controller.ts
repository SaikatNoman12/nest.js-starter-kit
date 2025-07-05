import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/pagination/dto/pagination-response.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all')
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination data',
    type: PaginatedResponseDto,
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @ActiveUser('sub') userId: number,
  ) {
    console.log('userId comes form active user', userId);
    return this.userService.findAll(paginationDto);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user' })
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
