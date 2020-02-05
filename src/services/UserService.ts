import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export class UserService {
    constructor(@OrmRepository() private userRepository: UserRepository) {}

    public getUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
