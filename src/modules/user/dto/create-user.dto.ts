import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Abdullah Al Nomaan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'abc@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'abc123123abc' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsEmpty()
  refresh?: string;
}
