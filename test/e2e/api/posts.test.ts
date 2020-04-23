import app from "../utils/testApp";
import request from "supertest";
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
let testPostCommentId: string;

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
  postRepository = db.getCustomRepository(PostRepository);
  await userRepository.save(UserSeed);
  await postRepository.save(PostSeed);
});

afterAll(async () => {
  await db.close();
});

describe("GET /api/posts/:id", () => {
  it("200: Post 조회에 성공해서 조회수, 점수가 증가한다", async () => {
    const response = await request(app)
      .get(`/api/posts/${PostSeed[0].id}`)
      .set(setHeader(""))
      .expect(200);

    const { body } = response;
    expect(body.title).toBe(PostSeed[0].title);
    expect(body.content).toBe(PostSeed[0].content);
    expect(body.previewContent).toBe(PostSeed[0].previewContent);
    expect(body.view).toBe(1);
    expect(body.score).toBe(1);
  });

  it("400: 해당하는 Post가 없어서 조회에 실패한다", async () => {
    await request(app).get("/api/posts/notId").set(setHeader("")).expect(400);
  });
});

describe("GET /api/posts", () => {
  it("200: Post 조회에 성공한다", async () => {
    const response = await request(app)
      .get("/api/posts?offset=0&limit=20")
      .set(setHeader(""))
      .expect(200);

    const { body } = response;
    expect(body.length).toBe(2);
    expect(body[0].title).toBe(PostSeed[0].title);
    expect(body[0].previewContent).toBe(PostSeed[0].previewContent);
    expect(body[1].title).toBe(PostSeed[1].title);
    expect(body[1].previewContent).toBe(PostSeed[1].previewContent);
  });

  // PostSeed[0]의 점수가 1이기 때문에(조회로 인한 증가) 더 인기글이다.
  it("200: 주간 인기 Post 조회에 성공한다", async () => {
    const response = await request(app)
      .get("/api/posts?offset=0&limit=8&sort=best")
      .set(setHeader(""))
      .expect(200);

    const { body } = response;
    expect(body.length).toBe(2);
    expect(body[0].title).toBe(PostSeed[0].title);
    expect(body[0].previewContent).toBe(PostSeed[0].previewContent);
    expect(body[1].title).toBe(PostSeed[1].title);
    expect(body[1].previewContent).toBe(PostSeed[1].previewContent);
  });

  it("204: offset과 limit에 해당하는 Post가 없어서 빈 객체를 반환한다", async () => {
    const response = await request(app)
      .get("/api/posts?offset=20&limit=20")
      .set(setHeader(""))
      .expect(204);

    const { body } = response;
    expect(body).toStrictEqual({});
  });
});

describe("POST /api/posts", () => {
  it("201: Post 작성에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .post("/api/posts")
      .set(setHeader(token))
      .send({
        title: "제목 입니다.",
        content: "내용 입니다.",
      })
      .expect(201);

    const { body } = response;
    expect(body.title).toBe("제목 입니다.");
    expect(body.content).toBe("내용 입니다.");
    expect(body.previewContent).toBe("내용 입니다.");
    expect(body.view).toBe(0);
    expect(body.like).toBe(0);
  });
});

describe("PUT /api/posts/:id", () => {
  it("403: 권한이 없어서 Post 수정에 실패한다", async () => {
    const token = generateAccessToken({
      id: "111deeee-a0f7-470f-b31f-ede0033efece",
      realName: "사길동",
      email: "hellojest2@gmail.com",
    } as any);
    await request(app)
      .put(`/api/posts/${PostSeed[0].id}`)
      .set(setHeader(token))
      .send({
        title: "수정한 테스트 제목입니다.",
        content: "수정한 테스트 내용 입니다.",
      })
      .expect(403);
  });

  it("200: Post 수정에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .put(`/api/posts/${PostSeed[0].id}`)
      .set(setHeader(token))
      .send({
        title: "수정한 테스트 제목입니다.",
        content: "수정한 테스트 내용 입니다.",
      })
      .expect(200);

    const { body } = response;
    expect(body.title).toBe("수정한 테스트 제목입니다.");
    expect(body.content).toBe("수정한 테스트 내용 입니다.");
    expect(body.previewContent).toBe("수정한 테스트 내용 입니다.");
  });
});

describe("DELETE /api/posts/:id", () => {
  it("403: 권한이 없어서 Post 삭제에 실패한다", async () => {
    const token = generateAccessToken({
      id: "111deeee-a0f7-470f-b31f-ede0033efece",
      realName: "사길동",
      email: "hellojest2@gmail.com",
    } as any);
    await request(app)
      .delete(`/api/posts/${PostSeed[1].id}`)
      .set(setHeader(token))
      .expect(403);
  });

  it("200: Post 삭제에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .delete(`/api/posts/${PostSeed[1].id}`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.postId).toBe(PostSeed[1].id);
    expect(body.isDelete).toBeTruthy();
  });
});

describe("POST /api/posts/:id/like", () => {
  it("200: Post 좋아요를 한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .post(`/api/posts/${PostSeed[0].id}/like`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.id).toBe(PostSeed[0].id);
    expect(body.like).toBe(1);
  });
});

describe("GET /api/posts/:id/like", () => {
  it("200: 좋아요를 한 Post의 상태를 조회하고 True를 반환한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .get(`/api/posts/${PostSeed[0].id}/like`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.isPostLiked).toBeTruthy();
  });
});

describe("DELETE /api/posts/:id/like", () => {
  it("200: Post 좋아요를 취소한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .delete(`/api/posts/${PostSeed[0].id}/like`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.id).toBe(PostSeed[0].id);
    expect(body.like).toBe(0);
  });
});

describe("GET /api/posts/:id/like", () => {
  it("200: 좋아요를 취소 한 Post의 상태를 조회하고 False를 반환한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .get(`/api/posts/${PostSeed[0].id}/like`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.isPostLiked).toBeFalsy();
  });
});

describe("POST /api/posts/:postId/comments", () => {
  it("201: Post 댓글 작성에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .post(`/api/posts/${PostSeed[0].id}/comments`)
      .set(setHeader(token))
      .send({
        text: "댓글 내용입니다.",
      })
      .expect(201);

    const { body } = response;
    expect(body.text).toBe("댓글 내용입니다.");
  });

  it("400: 해당하는 Post가 없어서 댓글 작성에 실패한다", async () => {
    const token = generateAccessToken(user as any);
    await request(app)
      .post("/api/posts/notPostId/comments")
      .set(setHeader(token))
      .send({
        text: "댓글 내용입니다.",
      })
      .expect(400);
  });
});

describe("GET /api/posts/:postId/comments", () => {
  it("200: Post 댓글 조회에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .get(`/api/posts/${PostSeed[0].id}/comments`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.count).toBe(1);
    expect(body.comments[0].text).toBe("댓글 내용입니다.");
    expect(body.comments[0].postId).toBe(PostSeed[0].id);
    testPostCommentId = body.comments[0].id;
  });

  it("400: 해당하는 Post가 없어서 댓글 조회에 실패한다", async () => {
    const token = generateAccessToken(user as any);
    await request(app)
      .get("/api/posts/notPostId/comments")
      .set(setHeader(token))
      .expect(400);
  });
});

describe("POST /api/posts/:postId/comments/:id/replies", () => {
  it("201: Post 댓글 답글 작성에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .post(
        `/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}/replies`,
      )
      .set(setHeader(token))
      .send({
        text: "댓글 내용입니다.",
      })
      .expect(201);

    const { body } = response;
    expect(body.parent).toBe(testPostCommentId);
    expect(body.depth).toBe(1);
    expect(body.text).toBe("댓글 내용입니다.");
  });

  it("400: 해당하는 댓글이 없어서 답글 작성에 실패한다", async () => {
    const token = generateAccessToken(user as any);
    await request(app)
      .post(`/api/posts/${PostSeed[0].id}/comments/notCommentId/replies`)
      .set(setHeader(token))
      .send({
        text: "댓글 내용입니다.",
      })
      .expect(400);
  });
});

describe("GET /api/posts/:postId/comments/:id/replies", () => {
  it("200: Post 댓글 답글 조회에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .get(`/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}/replies`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body[0].text).toBe("댓글 내용입니다.");
    expect(body[0].parent).toBe(testPostCommentId);
    expect(body[0].depth).toBe(1);
    expect(body[0].postId).toBe(PostSeed[0].id);
  });

  it("400: 해당하는 Post가 없어서 댓글 조회에 실패한다", async () => {
    const token = generateAccessToken(user as any);
    await request(app)
      .get("/api/posts/notPostId/comments/notCommentId/replies")
      .set(setHeader(token))
      .expect(400);
  });
});

describe("PUT /api/posts/:postId/comments/:id", () => {
  it("403: 권한이 없어서 Post 댓글 수정에 실패한다", async () => {
    const token = generateAccessToken({
      id: "111deeee-a0f7-470f-b31f-ede0033efece",
      realName: "사길동",
      email: "hellojest2@gmail.com",
    } as any);
    await request(app)
      .put(`/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}`)
      .set(setHeader(token))
      .send({
        text: "수정한 댓글 내용입니다.",
      })
      .expect(403);
  });

  it("200: Post 댓글 수정에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .put(`/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}`)
      .set(setHeader(token))
      .send({
        text: "수정한 댓글 내용입니다.",
      })
      .expect(200);

    const { body } = response;
    expect(body.text).toBe("수정한 댓글 내용입니다.");
  });
});

describe("DELETE /api/posts/:postId/comments/:id", () => {
  it("403: 권한이 없어서 Post 댓글 삭제에 실패한다", async () => {
    const token = generateAccessToken({
      id: "111deeee-a0f7-470f-b31f-ede0033efece",
      realName: "사길동",
      email: "hellojest2@gmail.com",
    } as any);
    await request(app)
      .delete(`/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}`)
      .set(setHeader(token))
      .expect(403);
  });

  it("200: Post 댓글 삭제에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .delete(`/api/posts/${PostSeed[0].id}/comments/${testPostCommentId}`)
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.postId).toBe(PostSeed[0].id);
    expect(body.postCommentId).toBe(testPostCommentId);
    expect(body.isDelete).toBeTruthy();
  });
});
