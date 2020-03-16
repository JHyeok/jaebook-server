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

    const request = {
        id: "6d2deecf-a0f7-470f-b31f-ede0024efece",
        realName: "홍길동",
        email: "hellojest@gmail.com",
        password: "password",
    };

    it("GET /api/users/:id 를 성공한다", async () => {
        const result = await userController.getOne(request.id);
        expect(result.email).toBe(request.email);
        expect(result.realName).toBe(request.realName);
    });
});
