import "reflect-metadata";
import Container from "typedi";
import { createConnection, ConnectionOptions, useContainer } from "typeorm";
import { env } from "./env";

export async function createDatabaseConnection() {
    try {
        const connectionOpts: ConnectionOptions = {
            type: "mysql",
            host: env.database.host,
            port: env.database.port,
            username: env.database.usename,
            password: env.database.password,
            database: env.database.name,
            synchronize: env.database.synchronize,
            logging: env.database.logging,
            entities: [__dirname + "/entities/*{.ts,.js}"],
        };

        useContainer(Container);
        await createConnection(connectionOpts);
    } catch (error) {
        throw error;
    }
}
