import { ApiProperty } from '@nestjs/swagger';

export class SinglePaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Object of data.',
  })
  data?: T[];

  @ApiProperty({
    description: 'Indicates if the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message.',
    example: 'Request was successful.',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code.',
    example: 200,
  })
  status: number;
}
