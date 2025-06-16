import { Inject, Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedInterface } from './paginated';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PaginationProvider<T extends ObjectLiteral> {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery(
    paginationQueryDto: PaginationDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T> | null,
    relations?: string[],
  ): Promise<PaginatedInterface<T>> {
    const findOptions: FindManyOptions<T> = {
      skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
      take: paginationQueryDto.limit,
    };

    if (where) {
      findOptions.where = where;
    }

    if (relations) {
      findOptions.relations = relations;
    }

    const [allData, totalItems] = await Promise.all([
      repository.find(findOptions),
      repository.count(),
    ]);
    const currentPage = paginationQueryDto.page;
    const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);

    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const prevPage = currentPage === 1 ? currentPage : currentPage - 1;

    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    const response: PaginatedInterface<T> = {
      data: allData,
      meta: {
        itemsPerPage: paginationQueryDto.limit,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`,
      },
    };

    return response;
  }
}
