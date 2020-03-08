import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserController } from "../../../src/controllers/UserController";
import { UserService } from "../../../src/services/UserService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";

describe("UserController", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let userService: UserService;
    let userController: UserController;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        userService = new UserService(userRepository);
        userController = new UserController(userService);
        await userRepository.save(UserSeed);
    });

    afterAll(() => db.close());

    const userRequest = {
        realName: "홍길동",
        email: "hellojest@gmail.com",
        password: "password",
    };

    let testUserId: string;

    it("GET /api/users 를 성공한다", async () => {
        const result = await userController.getAll();
        expect(result[0].email).toBe(UserSeed[0].email);
        expect(result[0].realName).toBe(UserSeed[0].realName);
    });

    it("POST /api/users 를 성공한다", async () => {
        const result = await userController.create(userRequest as any);
        testUserId = result.id;
        expect(result.email).toBe(userRequest.email);
        expect(result.realName).toBe(userRequest.realName);
    });

    it("GET /api/users/:id 를 성공한다", async () => {
        const result = await userController.getOne(testUserId);
        expect(result.email).toBe(userRequest.email);
        expect(result.realName).toBe(userRequest.realName);
    });
});
