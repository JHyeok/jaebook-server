/* eslint-disable @typescript-eslint/camelcase */
import app from "../utils/testApp";
import request from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/middlewares/AuthMiddleware";

let db: Connection;
let userRepository: UserRepository;
let testRefreshToken: string;

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
});

afterAll(async () => {
  await db.close();
});

describe("GET /api/auth/user", () => {
  it("200: 유저 정보 반환에 성공한다", async () => {
    const token = generateAccessToken(user as any);
    const response = await request(app)
      .get("/api/auth/user")
      .set(setHeader(token))
      .expect(200);

    const { body } = response;
    expect(body.user.email).toEqual("hellojest@gmail.com");
    expect(body.user.realName).toEqual("홍길동");
  });

  it("401: 인증되지 않은 AccessToken으로 유저 정보 반환에 실패한다", async () => {
    await request(app)
      .get("/api/auth/user")
      .set(setHeader("notToken"))
      .expect(401);
  });
});

describe("POST /api/auth/register", () => {
  it("200: 회원가입에 성공한다", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set(setHeader(""))
      .send({
        realName: "김재혁",
        email: "dev.jhyeok@gmail.com",
        password: "test1234",
      })
      .expect(200);

    const { body } = response;
    expect(body.user.email).toEqual("dev.jhyeok@gmail.com");
    expect(body.user.realName).toEqual("김재혁");
    expect(body.accessToken).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
  });

  it("200: 이미 사용중인 이메일로 회원가입을 실패한다", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set(setHeader(""))
      .send({
        realName: "김재혁",
        email: "dev.jhyeok@gmail.com",
        password: "test1234",
      })
      .expect(200);

    const { body } = response;
    expect(body.error).toBeTruthy();
    expect(body.message).toEqual("이미 사용 중인 이메일입니다.");
  });
});

describe("POST /api/auth/login", () => {
  it("200: 로그인에 성공한다", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set(setHeader(""))
      .send({
        email: "dev.jhyeok@gmail.com",
        password: "test1234",
      })
      .expect(200);

    const { body } = response;
    expect(body.accessToken).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
    testRefreshToken = body.refreshToken;
  });

  it("401: 이메일 또는 비밀번호가 틀려서 로그인에 실패한다", async () => {
    await request(app)
      .post("/api/auth/login")
      .set(setHeader(""))
      .send({
        email: "dev.jhyeok@gmail.com",
        password: "notpassword",
      })
      .expect(401);
  });
});

describe("POST /api/auth/token/refresh", () => {
  it("200: 토큰 재발급에 성공한다", async () => {
    const response = await request(app)
      .post("/api/auth/token/refresh")
      .set(setHeader(""))
      .send({
        refresh_token: testRefreshToken,
        grant_type: "refresh_token",
      })
      .expect(200);

    const { body } = response;
    expect(body.accessToken).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
  });

  it("401: JWT 형식이 아닌 토큰으로 재발급에 실패한다", async () => {
    await request(app)
      .post("/api/auth/token/refresh")
      .set(setHeader(""))
      .send({
        refresh_token: "notToken",
        grant_type: "refresh_token",
      })
      .expect(401);
  });

  it("401: 유저 정보가 일치하지 않는 토큰으로 재발급에 실패한다", async () => {
    const token = generateRefreshToken(user as any);
    await request(app)
      .post("/api/auth/token/refresh")
      .set(setHeader(""))
      .send({
        refresh_token: token,
        grant_type: "refresh_token",
      })
      .expect(401);
  });
});
