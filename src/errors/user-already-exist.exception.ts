import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistException extends HttpException {
  constructor(fieldName: string, fieldValue: string) {
    super(
      `User with ${fieldName} ${fieldValue} already exists.`,
      HttpStatus.CONFLICT,
    );
  }
}
