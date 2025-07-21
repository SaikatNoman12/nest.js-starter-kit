import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
