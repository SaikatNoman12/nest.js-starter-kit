import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_END || 'LOCAL_SERVER',
  allowOrigin: process.env.ALLOW_ORIGINS,
}));
