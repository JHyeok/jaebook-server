import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export class UserService {
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    public createUser(user: User): Promise<User> {
        user.hashPassword();
        const newUser = this.userRepository.save(user);
        return newUser;
    }

    public getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    public getUsersById(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    public updateUser(id: string, user: User): Promise<User> {
        user.hashPassword();
        user.id = id;
        return this.userRepository.save(user);
    }

    public async deleteUser(id: string): Promise<string> {
        const userToRemove = await this.userRepository.findOne(id);
        this.userRepository.remove(userToRemove);
        return `remove user: ${id}`;
    }
}
