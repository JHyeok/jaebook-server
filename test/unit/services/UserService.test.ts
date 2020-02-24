import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserService } from "../../../src/services/UserService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { User } from "../../../src/entities/User";

describe("User Service", () => {
    let db: Connection;
    let userService: UserService;
    let userRepository: UserRepository;

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

    it("유저를 생성하고 정보를 반환한다", async () => {
        const newUser = await userService.createUser(userRequest as any);
        newUserId = newUser.id;

        expect(newUser.realName).toBe(userRequest.realName);
        expect(newUser.email).toBe(userRequest.email);
    });

    it("Id가 일치하는 유저를 찾아서 반환한다", async () => {
        const newUserInDB = await userService.getUsersById(newUserId);

        expect(newUserInDB.realName).toBe(userRequest.realName);
        expect(newUserInDB.email).toBe(userRequest.email);
    });

    it("이메일이 사용 중인지, 사용하지 않는지 체크해서 반환한다", async () => {
        // 유저 테이블에 이미 등록되어서 사용중인 이메일
        const isDuplicateUser = await userService.isDuplicateUser(userRequest.email);
        expect(isDuplicateUser).toBeTruthy();

        // 유저 테이블에 등록되지 않는 이메일
        const isUnDuplicateUser = await userService.isDuplicateUser("null@gmail.com");
        expect(isUnDuplicateUser).toBeFalsy();
    });
});
