import { Service } from "typedi";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

@Service()
export class UserService {
    public async getUsers() {
        const userRepository = getRepository(User);
        return userRepository.find();
    }

    public async getUserById(userId: string) {
        const userRepository = getRepository(User);

        return userRepository.findOne({
            where: { id: Number(userId) },
        });
    }

    public async createUser(user: User) {
        const userRepository = getRepository(User);

        return userRepository.save(user);
    }

    public async deleteUser(userId: string) {
        const userRepository = getRepository(User);
        const userToRemove = await userRepository.findOne({
            where: { id: Number(userId) },
        });

        return await userRepository.remove(userToRemove);
    }
}
