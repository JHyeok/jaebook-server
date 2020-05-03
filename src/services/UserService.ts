import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { PostRepository } from "../repositories/PostRepository";
import { PostCommentRepository } from "../repositories/PostCommentRepository";
import { CreateUserDto, UpdateUserDto } from "../dtos/UserDto";

@Service()
export class UserService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @InjectRepository() private postRepository: PostRepository,
    @InjectRepository() private postCommentRepository: PostCommentRepository,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = createUserDto.toEntity();
    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  public getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      select: ["id", "email", "realName", "createdAt"],
      where: { id: id },
    });
  }

  public getPostsByUserId(userId: string) {
    return this.postRepository.getPostsByUserId(userId);
  }

  public getCommentsByUserId(userId: string) {
    return this.postCommentRepository.getCommentsByUserId(userId);
  }

  public async updateUser(
    userId: string,
    targetUserId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userId !== targetUserId) {
      return null;
    }

    const userToUpdate = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (userToUpdate?.id === userId) {
      userToUpdate.realName = updateUserDto.realName;
      return await this.userRepository.save(userToUpdate);
    }

    return null;
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
