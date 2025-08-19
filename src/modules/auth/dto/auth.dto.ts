import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProvidersEnum } from 'src/shared/enums/provider.enums';

export class AuthDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'Admin123@' })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ enum: ProvidersEnum, example: ProvidersEnum.LOCAL })
  @IsEnum(ProvidersEnum)
  @IsOptional()
  @Transform(({ value }) => (value ? value : ProvidersEnum.LOCAL))
  provider: ProvidersEnum;
}
