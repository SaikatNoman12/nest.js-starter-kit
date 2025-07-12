import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SinglePaginatedResponseDto } from 'src/common/pagination/dto/single-pagination-response.dto';

export const ApiSingleResponseDto = <T extends Type<any>>(
  dto: T,
  wrapWithResponsePayload = true,
) => {
  return applyDecorators(
    ApiExtraModels(SinglePaginatedResponseDto, dto),
    ApiOkResponse({
      schema: wrapWithResponsePayload
        ? {
            allOf: [{ $ref: getSchemaPath(SinglePaginatedResponseDto) }],
            properties: {
              data: { $ref: getSchemaPath(dto) },
            },
          }
        : {
            type: 'object',
            items: undefined,
            $ref: getSchemaPath(dto),
          },
    }),
  );
};
