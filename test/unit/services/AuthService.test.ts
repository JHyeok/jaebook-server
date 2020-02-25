import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { AuthService } from "../../../src/services/AuthService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { User } from "../../../src/entities/User";
import { UserSeed } from "../seeds/UserTestSeed";

describe("AuthService", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let authService: AuthService;

    beforeAll(async () => {
        db = await createMemoryDatabase([User]);
        userRepository = db.getRepository(User);
        authService = new AuthService(userRepository);
        await userRepository.save(UserSeed);
    });

    afterAll(() => db.close());

    const userRequest = {
        realName: "홍길동",
        email: "hellojest@gmail.com",
        password: "password",
    };

    it("이메일과 비밀번호가 맞으면 유저 정보를 반환한다", async () => {
        const user = await authService.validateUser(userRequest.email, userRequest.password);
        expect(user).toBeInstanceOf(User);
        expect(user.realName).toBe(userRequest.realName);
        expect(user.email).toBe(userRequest.email);
    });

    it("이메일이 틀리면 undefined를 반환한다", async () => {
        const user = await authService.validateUser("null@gmail.com", userRequest.password);
        expect(user).toBeUndefined();
    });

    it("비밀번호가 틀리면 undefined를 반환한다", async () => {
        const user = await authService.validateUser(userRequest.email, "notpassword");
        expect(user).toBeUndefined();
    });
});
