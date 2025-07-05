import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Abdullah Al Nomaan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'xyz@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'abc123123abc' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
