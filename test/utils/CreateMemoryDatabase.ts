import { Container } from "typedi";
import { createConnection, EntitySchema, useContainer } from "typeorm";
type Entity = Function | string | EntitySchema<any>;

/**
 * 테스트에 사용할 In-memory Database를 만든다
 * @param entities
 */
export async function createMemoryDatabase(entities: Entity[]) {
    useContainer(Container);
    return createConnection({
        type: "sqlite",
        database: ":memory:",
        entities,
        dropSchema: true,
        synchronize: true,
        logging: false,
    });
}
