import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'Abdullah Al Nomaan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'xyz@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
