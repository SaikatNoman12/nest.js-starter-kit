import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProvidersEnum } from 'src/shared/enums/provider.enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Abdullah Al Nomaan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin123@' })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @IsEmpty()
  refresh?: string;

  @ApiProperty({ enum: ProvidersEnum, example: ProvidersEnum.LOCAL })
  @IsEnum(ProvidersEnum)
  @IsOptional()
  @Transform(({ value }) => (value ? value : ProvidersEnum.LOCAL))
  provider: ProvidersEnum;
}
