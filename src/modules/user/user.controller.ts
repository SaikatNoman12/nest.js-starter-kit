import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ActiveUser } from 'src/modules/auth/decorators/active-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { PaginatedResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all')
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiResponseDto(GetUserDto, true, true)
  findAll(
    @Query() paginationDto: PaginationDto,
    @ActiveUser('sub') userId: number,
  ): Promise<PaginatedResponseDto<GetUserDto>> {
    console.log('userId comes form active user', userId);
    return this.userService.findAll(paginationDto);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user' })
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
