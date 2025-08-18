import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'local-server')
    .default('local-server'),
  ENV_MODE: Joi.string().required(),
  PORT: Joi.number().valid(5001, 3000).default(3000),
  DB_TYPE: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_AUTO_LOAD: Joi.boolean().required(),
  SYNC: Joi.boolean().required(),

  JWT_TOKEN_SECRET: Joi.string().required(),
  JWT_TOKEN_EXPIRES_IN: Joi.number().required(),
  AUTH_TOKEN_COOKIE_NAME: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  ALLOW_ORIGINS: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
});
