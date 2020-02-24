/* src/utils/testing-helpers/createMemDB.js */
import { createConnection, EntitySchema } from "typeorm";
type Entity = Function | string | EntitySchema<any>;

export async function createMemoryDatabase(entities: Entity[]) {
    return createConnection({
        // name, // let TypeORM manage the connections
        type: "sqlite",
        database: ":memory:",
        entities,
        dropSchema: true,
        synchronize: true,
        logging: false,
    });
}
