/**
 * NODE_ENV에 따른 .env 파일 로드
 */
require("dotenv").config({ path: `config/.env.${process.env.NODE_ENV || "development"}` });

/**
 * 환경 변수
 */
export const env = {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
    app: {
        port: Number(process.env.PORT) || 3000,
        apiPrefix: process.env.API_PREFIX || "api",
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3306,
        usename: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
        logging: Boolean(process.env.TYPEORM_LOGGING),
    },
};
