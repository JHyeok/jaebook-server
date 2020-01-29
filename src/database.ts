import "reflect-metadata";
import { createConnection, Connection, ConnectionOptions } from "typeorm";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

const ENV_PATH: string = `config/.env.${process.env.NODE_ENV || "development"}`;
require("dotenv").config({ path: ENV_PATH });

const connectionOpts: ConnectionOptions = {
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: isDevelopment,
    logging: isDevelopment,
    entities: [__dirname + "/entities/*{.ts,.js}"],
};

const connection: Promise<Connection> = createConnection(connectionOpts);

export default connection;
