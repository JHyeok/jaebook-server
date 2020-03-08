import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { AuthController } from "../../../src/controllers/AuthController";
import { UserService } from "../../../src/services/UserService";
import { AuthService } from "../../../src/services/AuthService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";

describe("AuthController", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let userService: UserService;
    let authService: AuthService;
    let authController: AuthController;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        userService = new UserService(userRepository);
        authService = new AuthService(userRepository);
        authController = new AuthController(authService, userService);
        await userRepository.save(UserSeed);
    });

    afterAll(() => db.close());

    const userRequest = {
        realName: "홍길동2",
        email: "hellojest2@gmail.com",
        password: "password",
    };

    it("POST /api/auth/register 를 성공한다", async () => {
        const result = await authController.register(userRequest as any);
        expect(result.userInfo.email).toBe(userRequest.email);
        expect(result.userInfo.realName).toBe(userRequest.realName);
    });

    it("중복된 이메일로 POST /api/auth/register 에서 오류를 반환한다", async () => {
        const result = await authController.register(userRequest as any);
        expect(result.code).toBe("ERR_REGISTER_DUPLICATE_EMAIL");
        expect(result.message).toBe("이미 사용 중인 이메일입니다.");
    });

    it("POST /api/auth/login 을 성공한다", async () => {
        const result = await authController.login("hellojest@gmail.com", "password");
        expect(result.userInfo.email).toBe("hellojest@gmail.com");
        expect(result.userInfo.realName).toBe("홍길동");
    });

    it("틀린 이메일로 POST /api/auth/login 에서 오류를 반환한다", async () => {
        const result = await authController.login("null@gmail.com", "password");
        expect(result.code).toBe("ERR_LOGIN_EMAIL_PASSWORD");
        expect(result.message).toBe("유효하지 않은 사용자 이메일/비밀번호 입니다.");
    });

    it("틀린 비밀번호로 POST /api/auth/login 에서 오류를 반환한다", async () => {
        const result = await authController.login("hellojest@gmail.com", "notpassword");
        expect(result.code).toBe("ERR_LOGIN_EMAIL_PASSWORD");
        expect(result.message).toBe("유효하지 않은 사용자 이메일/비밀번호 입니다.");
    });
});
