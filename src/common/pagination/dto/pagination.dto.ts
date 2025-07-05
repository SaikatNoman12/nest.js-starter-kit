import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsPositive()
  page: number = 1;
}
