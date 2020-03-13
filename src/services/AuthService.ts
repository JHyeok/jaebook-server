import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export class AuthService {
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    public async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            select: ["id", "realName", "email", "password"],
            where: {
                email,
            },
        });

        if (user) {
            const isPasswordMatch = await user.comparePassword(password);

            if (isPasswordMatch) {
                return user;
            }
        }

        return undefined;
    }

    public async validateUserToken(userId: string, refreshToekn: string): Promise<User> {
        const user = await this.userRepository.findOne({
            select: ["id", "realName", "email"],
            where: {
                id: userId,
                refreshToekn: refreshToekn,
            },
        });

        if (user) {
            return user;
        }

        return undefined;
    }

    public async saveRefreshToken(user: User, token: string): Promise<void> {
        user.refreshToekn = token;
        await this.userRepository.save(user);
    }
}
