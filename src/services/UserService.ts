import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { CreateUserDto } from "../dtos/UserDto";

@Service()
export class UserService {
    constructor(@InjectRepository() private userRepository: UserRepository) {}

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = createUserDto.toEntity();
        const newUser = await this.userRepository.save(user);

        return newUser;
    }

    public getUsersById(id: string): Promise<User> {
        return this.userRepository.findOne({
            select: ["id", "email", "realName", "createdAt"],
            where: { id: id },
        });
    }

    /**
     * 동일한 이메일의 사용자가 있는지 검사
     * @param email 이메일
     */
    public async isDuplicateUser(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            return true;
        } else {
            return false;
        }
    }
}
