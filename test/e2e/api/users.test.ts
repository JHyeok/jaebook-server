import app from "../utils/testApp";
import { agent, Response } from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { generateAccessToken } from "../../../src/middlewares/AuthMiddleware";

describe("GET /api/users", () => {
    let db: Connection;
    let userRepository: UserRepository;

    const setHeader = (token: string): { Authorization: string; Accept: string } => ({
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    });

    const user = {
        id: "6d2deecf-a0f7-470f-b31f-ede0024efece",
        realName: "홍길동",
        email: "hellojest@gmail.com",
    };

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        await userRepository.save(UserSeed);
    });

    afterAll(async done => {
        await db.close();
        done();
    });

    it("200: 유저 정보를 요청하고 데이터가 반환된다", done => {
        agent(app)
            .get("/api/users/6d2deecf-a0f7-470f-b31f-ede0024efece")
            .expect(200)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                const { body } = res;
                expect(body.email).toEqual("hellojest@gmail.com");
                expect(body.realName).toEqual("홍길동");
                done();
            });
    });

    it("401: 인증되지 않은 AccessToken으로 유저 정보를 요청하고 오류가 반환된다", done => {
        agent(app)
            .get("/api/users/me")
            .set(setHeader("notToken"))
            .expect(401)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                done();
            });
    });

    it("200: AccessToken으로 유저 정보를 요청하고 데이터가 반환된다", done => {
        const token = generateAccessToken(user as any);
        agent(app)
            .get("/api/users/me")
            .set(setHeader(token))
            .expect(200)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                const { body } = res;
                expect(body.user.email).toEqual("hellojest@gmail.com");
                expect(body.user.realName).toEqual("홍길동");
                done();
            });
    });
});
