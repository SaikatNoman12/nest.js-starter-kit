import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  access?: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  refresh?: string;

  @ApiProperty({ example: 'Login successfully.', required: false })
  message?: string;

  @ApiProperty({ example: 200, required: false })
  status?: number;
}
