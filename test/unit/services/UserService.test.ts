import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserService } from "../../../src/services/UserService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { User } from "../../../src/entities/User";

describe("UserService", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let userService: UserService;

    beforeAll(async () => {
        db = await createMemoryDatabase([User]);
        userRepository = db.getRepository(User);
        userService = new UserService(userRepository);
    });

    afterAll(() => db.close());

    const userRequest = {
        realName: "홍길동",
        email: "hellojest@gmail.com",
        password: "password",
    };

    let newUserId: string;

    it("유저를 생성하고 생성된 정보를 반환한다", async () => {
        const newUser = await userService.createUser(userRequest as any);
        newUserId = newUser.id;
        expect(newUser.realName).toBe(userRequest.realName);
        expect(newUser.email).toBe(userRequest.email);
    });

    it("Id가 일치하는 유저를 찾아서 유저 정보를 반환한다", async () => {
        const user = await userService.getUsersById(newUserId);
        expect(user).toBeInstanceOf(User);
        expect(user.realName).toBe(userRequest.realName);
        expect(user.email).toBe(userRequest.email);
    });

    it("이미 등록된 이메일의 중복 여부를 검사하면 true를 반환한다", async () => {
        const isDuplicateUser = await userService.isDuplicateUser(userRequest.email);
        expect(isDuplicateUser).toBeTruthy();
    });

    it("등록되지 않은 이메일의 중복 여부를 검사하면 false를 반환한다", async () => {
        const isUnDuplicateUser = await userService.isDuplicateUser("null@gmail.com");
        expect(isUnDuplicateUser).toBeFalsy();
    });
});
