import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { AuthService } from "../../../src/services/AuthService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { User } from "../../../src/entities/User";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { LoginUserDto } from "../../../src/dtos/UserDto";

describe("AuthService", () => {
  let db: Connection;
  let userRepository: UserRepository;
  let authService: AuthService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    authService = new AuthService(userRepository);
    await userRepository.save(UserSeed);
  });

  afterAll(() => db.close());

  const request = {
    id: "6d2deecf-a0f7-470f-b31f-ede0024efece",
    realName: "홍길동",
    email: "hellojest@gmail.com",
    password: "password",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjOGM5ODhiOS1hZTNhLTRmNjgtOTVkZi0zNWNjM2JjZDRhNWUiLCJpYXQiOjE1ODMxMTU4OTYsImV4cCI6MTU4NDMyNTQ5Nn0.w9Yze38ys8OIGmde7HEH2Gj_xZe0uIy7Di4Od5zzSP4",
  };

  const loginUserDto = new LoginUserDto();
  loginUserDto.email = request.email;
  loginUserDto.password = request.password;

  it("이메일과 비밀번호가 일치하면 유저 정보를 반환한다", async () => {
    const user = await authService.validateUser(loginUserDto);
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(request.id);
    expect(user.realName).toBe(request.realName);
    expect(user.email).toBe(request.email);
  });

  it("이메일과 비밀번호가 일치하지 않으면 undefined를 반환한다", async () => {
    loginUserDto.password = "notPassword";
    const user = await authService.validateUser(loginUserDto);
    expect(user).toBeUndefined();
  });

  it("유저Id와 토큰이 일치하면 유저 정보를 반환한다", async () => {
    const user = await authService.validateUserToken(
      request.id,
      request.refreshToken,
    );
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(request.id);
    expect(user.realName).toBe(request.realName);
    expect(user.email).toBe(request.email);
  });

  it("유저Id와 토큰이 일치하지 않으면 undefined를 반환한다", async () => {
    const user = await authService.validateUserToken(request.id, "not token");
    expect(user).toBeUndefined();
  });
});
