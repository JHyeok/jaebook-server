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

  /**
   * 사용자를 생성한다.
   * @param createUserDto 사용자 생성 DTO
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = createUserDto.toEntity();
    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  /**
   * 사용자 정보를 조회한다.
   * @param id 사용자 Id
   */
  public async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      select: ["id", "email", "realName", "createdAt"],
      where: { id: id },
    });
  }

  /**
   * 사용자가 작성한 포스트 목록을 조회한다.
   * @param userId 사용자 Id
   */
  public async getPostsByUserId(userId: string) {
    return await this.postRepository.getPostsByUserId(userId);
  }

  /**
   * 사용자가 작성한 삭제되지 않은 댓글과 답글들을 조회한다.
   * @param userId 사용자 Id
   */
  public async getCommentsByUserId(userId: string) {
    return await this.postCommentRepository.getCommentsByUserId(userId);
  }

  /**
   * 사용자 정보를 수정한다.
   * @param userId 요청한 사용자 Id
   * @param targetUserId 사용자 정보가 수정되는 사용자 Id
   * @param updateUserDto 사용자 정보 수정 DTO
   */
  public async updateUser(
    userId: string,
    targetUserId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // 변경을 요청한 사용자 Id와 변경이 되는 사용자의 Id를 검사한다.
    // 다른 사용자가 Front를 우회해서 악의적으로 변경을 요청하는 부분에 대한 방어.
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
   * 동일한 이메일의 사용자가 있는지 검사한다.
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
