/**
 * NODE_ENV에 따른 .env 파일을 로드한다.
 */
require("dotenv").config({
  path: `config/.env.${process.env.NODE_ENV || "development"}`,
});

/**
 * 환경 변수
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  app: {
    port: Number(process.env.PORT) || 3000,
    apiPrefix: process.env.API_PREFIX || "/api",
    jwtAccessSecret: process.env.JWT_SECRET_ACCESS_KEY,
    jwtRefreshSecret: process.env.JWT_SECRET_REFRESH_KEY,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    usename: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    logging: process.env.TYPEORM_LOGGING === "true",
  },
  swagger: {
    route: process.env.SWAGGER_ROUTE,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
};
