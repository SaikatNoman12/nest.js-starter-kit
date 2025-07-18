import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_IN ?? '3600', 10),
  authTokenCookieName: process.env.AUTH_TOKEN_COOKIE_NAME,
  refreshTokenExpiresIn: parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_IN ?? '86400',
    10,
  ),
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}));
