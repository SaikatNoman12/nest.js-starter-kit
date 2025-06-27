import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    plainPassword: string | Buffer,
    hashPassword: string | Buffer,
  ): Promise<boolean>;
}
