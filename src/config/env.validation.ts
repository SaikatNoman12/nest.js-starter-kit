import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'local-server')
    .default('local-server'),
  ENV_MODE: Joi.string().required(),
  DB_TYPE: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_AUTO_LOAD: Joi.boolean().required(),
  SYNC: Joi.boolean().required(),
});
