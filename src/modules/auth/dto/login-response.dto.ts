import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  access?: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  refresh?: string;

  @ApiProperty({ example: 'Login successful', required: false })
  message?: string;

  @ApiProperty({ example: 200, required: false })
  status?: number;
}
