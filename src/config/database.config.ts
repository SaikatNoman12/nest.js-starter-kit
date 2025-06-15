import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mode: process.env.ENV_MODE,
  type: process.env.DB_TYPE,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  load: process.env.DB_AUTO_LOAD === 'true' ? 'true' : false,
  synchronize: process.env.SYNC === 'true' ? 'true' : false,
}));
