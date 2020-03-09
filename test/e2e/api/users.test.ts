import "reflect-metadata";
import app from "../utils/testApp";
import { agent, Response } from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";

describe("GET /api/users", () => {
    let db: Connection;
    let userRepository: UserRepository;

    const setHeader = (): { Accept: string } => ({
        Accept: "application/json",
    });

    beforeAll(async done => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        await userRepository.save(UserSeed);
        done();
    });

    afterAll(() => db.close());

    it("200: 유저 정보를 요청하고 데이터가 반환된다", done => {
        agent(app)
            .get("/api/users")
            .set(setHeader())
            .expect(200)
            .end((err: any, res: Response) => {
                const { body } = res;
                expect(body[0].email).toEqual("hellojest@gmail.com");
                expect(body[0].realName).toEqual("홍길동");
                done();
            });
    });
});
