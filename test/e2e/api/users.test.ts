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

let db: Connection;
let userRepository: UserRepository;
let postRepository: PostRepository;
let postCommentRepository: PostCommentRepository;

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
      .get("/api/users/6d2deecf-a0f7-470f-b31f-ede0024efece")
      .expect(200);

    const { body } = response;
    expect(body.email).toEqual("hellojest@gmail.com");
    expect(body.realName).toEqual("홍길동");
  });

  it("400: 잘못된 유저ID 파라미터로 반환에 실패한다", async () => {
    await request(app)
      .get("/api/users/not-user")
      .expect(400);
  });
});

describe("GET /api/users/:id/posts", () => {
  it("200: 유저가 작성한 게시글 정보 반환에 성공한다", async () => {
    const response = await request(app)
      .get("/api/users/6d2deecf-a0f7-470f-b31f-ede0024efece/posts")
      .expect(200);

    const { body } = response;
    expect(body[0].title).toEqual("테스트 제목입니다.");
    expect(body[1].title).toEqual("테스트 제목2입니다.");
  });

  it("204: 잘못된 유저ID로 빈 배열을 반환한다", async () => {
    await request(app)
      .get("/api/users/not-user/posts")
      .expect(204);
  });
});

describe("GET /api/users/:id/comments", () => {
  it("200: 유저가 작성한 댓글 정보 반환에 성공한다", async () => {
    const response = await request(app)
      .get("/api/users/6d2deecf-a0f7-470f-b31f-ede0024efece/comments")
      .expect(200);

    const { body } = response;
    expect(body[0].text).toEqual("테스트 댓글입니다.");
    expect(body[1].text).toEqual("테스트 댓글2입니다.");
  });

  it("204: 잘못된 유저ID로 빈 배열을 반환한다", async () => {
    await request(app)
      .get("/api/users/not-user/comments")
      .expect(204);
  });
});
