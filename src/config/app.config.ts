import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'LOCAL_SERVER',
  allowOrigin: process.env.ALLOW_ORIGINS,
}));
