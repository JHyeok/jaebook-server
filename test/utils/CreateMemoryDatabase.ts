import { Container } from "typedi";
import { createConnection, useContainer } from "typeorm";

/**
 * 테스트에 사용할 In-memory Database를 만든다
 * @param entities
 */
export async function createMemoryDatabase() {
  useContainer(Container);
  return createConnection({
    type: "sqlite",
    database: ":memory:",
    entities: [__dirname + "/../../src/entities/*{.ts,.js}"],
    dropSchema: true,
    synchronize: true,
    logging: false,
  });
}
