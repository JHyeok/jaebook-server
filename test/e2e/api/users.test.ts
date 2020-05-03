import app from "../utils/testApp";
import request from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { PostCommentRepository } from "../../../src/repositories/PostCommentRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { PostSeed } from "../../utils/seeds/PostTestSeed";
import { PostCommentSeed } from "../../utils/seeds/PostCommentTestSeed";
import { generateAccessToken } from "../../../src/middlewares/AuthMiddleware";

let db: Connection;
let userRepository: UserRepository;
let postRepository: PostRepository;
let postCommentRepository: PostCommentRepository;

const setHeader = (
  token: string,
): { Authorization: string; Accept: string } => ({
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
  postRepository = db.getCustomRepository(PostRepository);
  await postRepository.save(PostSeed);
  postCommentRepository = db.getCustomRepository(PostCommentRepository);
  await postCommentRepository.save(PostCommentSeed);
});

afterAll(async () => {
  await db.close();
});

describe("GET /api/users/:id", () => {
  it("200: 유저 정보 반환에 성공한다", async () => {
    const response = await request(app)
      .get(`/api/users/${user.id}`)
      .expect(200);

    const { body } = response;
    expect(body.email).toEqual("hellojest@gmail.com");
    expect(body.realName).toEqual("홍길동");
  });

  it("400: 잘못된 유저Id 파라미터로 반환에 실패한다", async () => {
    await request(app).get("/api/users/not-user").expect(400);
  });
});

describe("GET /api/users/:id/posts", () => {
  it("200: 유저가 작성한 Post 반환에 성공한다", async () => {
    const response = await request(app)
      .get(`/api/users/${user.id}/posts`)
      .expect(200);

    const { body } = response;
    expect(body[0].title).toEqual("테스트 제목입니다.");
    expect(body[1].title).toEqual("테스트 제목2입니다.");
  });

  it("204: 잘못된 유저Id로 빈 배열을 반환한다", async () => {
    await request(app).get("/api/users/not-user/posts").expect(204);
  });
});

describe("GET /api/users/:id/comments", () => {
  it("200: 유저가 작성한 댓글 반환에 성공한다", async () => {
    const response = await request(app)
      .get(`/api/users/${user.id}/comments`)
      .expect(200);

    const { body } = response;
    expect(body[0].text).toEqual("테스트 댓글입니다.");
    expect(body[1].text).toEqual("테스트 댓글2입니다.");
  });

  it("204: 잘못된 유저Id로 빈 배열을 반환한다", async () => {
    await request(app).get("/api/users/not-user/comments").expect(204);
  });
});

describe("PUT /api/users/:id", () => {
  it("403: 권한이 없어서 유저 정보 수정에 실패한다", async () => {
    const token = generateAccessToken({
      id: "111deeee-a0f7-470f-b31f-ede0033efece",
      realName: "사길동",
      email: "hellojest2@gmail.com",
    } as any);
    await request(app)
      .put(`/api/users/${user.id}`)
      .set(setHeader(token))
      .send({
        realName: "김길동",
      })
      .expect(403);
  });

  it("200: 유저 정보 수정에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .set(setHeader(token))
      .send({
        realName: "김길동",
      })
      .expect(200);

    const { body } = response;
    expect(body.realName).toBe("김길동");
  });
});
