import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total number of items in the dataset',
    example: 100,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}

export class PaginationLinksDto {
  @ApiProperty({
    description: 'Link to the first page',
    example: 'http://example.com/api/items?page=1',
  })
  first: string;

  @ApiProperty({
    description: 'Link to the last page',
    example: 'http://example.com/api/items?page=10',
  })
  last: string;

  @ApiProperty({
    description: 'Link to the current page',
    example: 'http://example.com/api/items?page=1',
  })
  current: string;

  @ApiProperty({
    description: 'Link to the next page',
    example: 'http://example.com/api/items?page=2',
  })
  next: string;

  @ApiProperty({
    description: 'Link to the previous page',
    example: 'http://example.com/api/items?page=0',
  })
  previous: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of paginated data',
    example: [],
  })
  data: T[];

  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Request was successful',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  @ApiProperty({
    description: 'Links for pagination',
    type: PaginationLinksDto,
  })
  links: PaginationLinksDto;
}
