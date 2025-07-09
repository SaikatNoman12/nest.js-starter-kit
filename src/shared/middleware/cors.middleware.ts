import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { envConfigService } from 'src/config/env.config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req?.headers?.origin as string;

    if (origin && envConfigService.getOrigins().includes(origin)) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Cookie',
    );
    res.header('Access-Control-Allow-Credentials', 'true'); // needed for credentials
    if (req.method === 'OPTIONS') {
      return res.status(204).end(); // respond to preflight requests
    }
    next();
  }
}
