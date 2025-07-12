import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ActiveUser } from 'src/modules/auth/decorators/active-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { PaginatedResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { GetUserDto } from './dto/get-user.dto';
import { ApiSingleResponseDto } from 'src/shared/decorators/api-single-response.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-users')
  @ApiOperation({ summary: 'Get a list of users.' })
  @ApiResponseDto(GetUserDto, true, true)
  findAll(
    @Query() paginationDto: PaginationDto,
    @ActiveUser('sub') userId: number,
  ): Promise<PaginatedResponseDto<GetUserDto>> {
    console.log('userId comes form active user', userId);
    return this.userService.findAll(paginationDto);
  }

  @Get('get-user/:id')
  @ApiOperation({ summary: 'Get a single user.' })
  @ApiSingleResponseDto(GetUserDto, true)
  findOne(@Param('id') id: number) {
    console.log('id', id);
    return this.userService.findUser({ id });
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user' })
  @ApiSingleResponseDto(GetUserDto, true)
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiSingleResponseDto(GetUserDto, true)
  updateUser(@Body() userUpdateDto: UpdateUserDto, @Param('id') id: number) {
    return this.userService.update(userUpdateDto, id);
  }
}
