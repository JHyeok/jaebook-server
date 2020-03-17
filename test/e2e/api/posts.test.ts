/* eslint-disable @typescript-eslint/camelcase */
import app from "../utils/testApp";
import { agent, Response } from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { PostSeed } from "../../utils/seeds/PostTestSeed";
import { generateAccessToken } from "../../../src/middlewares/AuthMiddleware";

let db: Connection;
let userRepository: UserRepository;
let postRepository: PostRepository;

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
    postRepository = db.getCustomRepository(PostRepository);
    await userRepository.save(UserSeed);
    await postRepository.save(PostSeed);
});

afterAll(async done => {
    await db.close();
    done();
});

describe("GET /api/posts", () => {
    it("200: Post 목록 반환에 성공한다", done => {
        agent(app)
            .get("/api/posts?offset=0&limit=20")
            .set(setHeader(""))
            .expect(200)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                const { body } = res;
                expect(body[1].title).toBe(PostSeed[0].title);
                expect(body[1].previewContent).toBe(PostSeed[0].previewContent);
                expect(body[0].title).toBe(PostSeed[1].title);
                expect(body[0].previewContent).toBe(PostSeed[1].previewContent);
                done();
            });
    });
});
