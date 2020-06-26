import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { LoginUserDto } from "../dtos/UserDto";

@Service()
export class AuthService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}

  /**
   * 사용자 정보가 유효한지 확인하고 유효하면 사용자 정보를 반환한다.
   * @param loginUserDto 사용자 로그인 DTO
   */
  public async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ["id", "realName", "email", "password"],
      where: {
        email: loginUserDto.email,
      },
    });

    if (user) {
      const isPasswordMatch = await user.comparePassword(loginUserDto.password);

      if (isPasswordMatch) {
        return user;
      }
    }

    return undefined;
  }

  /**
   * RefreshToken이 일치하는 사용자 정보를 반환한다.
   * @param userId 사용자 Id
   * @param refreshToekn RefreshToken
   */
  public async validateUserToken(
    userId: string,
    refreshToekn: string,
  ): Promise<User> {
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

  /**
   * RefreshToken을 사용자에게 저장한다.
   * @param user User
   * @param token RefreshToken
   */
  public async saveRefreshToken(user: User, token: string): Promise<void> {
    user.refreshToekn = token;
    await this.userRepository.save(user);
  }
}
