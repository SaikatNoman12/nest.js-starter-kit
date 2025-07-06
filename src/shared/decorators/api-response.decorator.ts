import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/pagination/dto/pagination-response.dto';

export const ApiResponseDto = <T extends Type<any>>(
  dto: T,
  wrapWithResponsePayload = true,
  isArray = false,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dto),
    ApiOkResponse({
      schema: wrapWithResponsePayload
        ? {
            allOf: [{ $ref: getSchemaPath(PaginatedResponseDto) }],
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(dto) },
                  }
                : { $ref: getSchemaPath(dto) },
            },
          }
        : {
            type: isArray ? 'array' : 'object',
            items: isArray ? { $ref: getSchemaPath(dto) } : undefined,
            $ref: isArray ? undefined : getSchemaPath(dto),
          },
    }),
  );
};
