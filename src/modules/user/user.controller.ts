import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/shared/decorators/api-response.decorator';
import { PaginatedResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { GetUserDto } from './dto/get-user.dto';
import { ApiSingleResponseDto } from 'src/shared/decorators/api-single-response.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedDetailsInterface } from 'src/common/pagination/paginated';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-users')
  @ApiOperation({ summary: 'Get list of users.' })
  @ApiResponseDto(GetUserDto, true, true)
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<GetUserDto>> {
    return this.userService.findAll(paginationDto);
  }

  @Get('get-user/:id')
  @ApiOperation({ summary: 'Get single user.' })
  @ApiSingleResponseDto(GetUserDto, true)
  findOne(
    @Param('id') id: number,
  ): Promise<PaginatedDetailsInterface<GetUserDto>> {
    return this.userService.findUser({ id });
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user.' })
  @ApiSingleResponseDto(GetUserDto, true)
  createUser(
    @Body() userDto: CreateUserDto,
  ): Promise<PaginatedDetailsInterface<GetUserDto>> {
    return this.userService.create(userDto);
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Update user.' })
  @ApiSingleResponseDto(GetUserDto, true)
  updateUser(
    @Body() userUpdateDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<PaginatedDetailsInterface<GetUserDto>> {
    return this.userService.update(userUpdateDto, id);
  }
}
