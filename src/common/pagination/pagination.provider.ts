import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedDetailsInterface, PaginatedInterface } from './paginated';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PaginationProvider<T extends ObjectLiteral> {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery({
    paginationQueryDto,
    message = 'data',
    repository,
    where,
    relations,
    select,
  }: {
    paginationQueryDto: PaginationDto;
    message: string;
    repository: Repository<T>;
    where?: FindOptionsWhere<T> | null;
    relations?: string[] | null;
    select?: string[] | null;
  }): Promise<PaginatedInterface<T>> {
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

    if (select && select.length) {
      findOptions.select = select;
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
      success: true,
      message: `Found all ${message.toLowerCase()}.`,
      status: HttpStatus.FOUND,
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

  public async paginateDetailsQuery({
    message = 'Data',
    repository,
    where,
    relations,
    select,
    isCreate,
  }: {
    message: string;
    repository: Repository<T>;
    where?: FindOptionsWhere<T> | null;
    relations?: string[] | null;
    select?: string[] | null;
    isCreate?: boolean;
  }): Promise<PaginatedDetailsInterface<T>> {
    const findOptions: FindOneOptions<T> = {};

    if (where) {
      findOptions.where = where;
    }

    if (relations) {
      findOptions.relations = relations;
    }

    if (select && select?.length) {
      findOptions.select = select;
    }

    const singleData = await repository.findOne(findOptions);

    if (!singleData) {
      return {
        data: null,
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: `This ${message.toLowerCase()} not found!`,
      };
    }

    const response: PaginatedDetailsInterface<T> = {
      data: singleData,
      success: true,
      message: `${isCreate ? `${message}` : 'This' + message.toLowerCase()} successfully.`,
      status: HttpStatus.OK,
    };

    return response;
  }
}
