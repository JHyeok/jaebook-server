import { Service } from "typedi";
import { getRepository } from "typeorm";
import User from "../entity/User";

@Service()
class UserService {
  public getUsers = async () => {
    const userRepository = getRepository(User);

    return userRepository.find();
  }

  public getUserById = async (userId: string) => {
    const userRepository = getRepository(User);

    return userRepository.findOne({
      where: { id: Number(userId) }
    });
  }

  public createUser = async (user: User) => {
    const userRepository = getRepository(User);

    return userRepository.save(user);
  }

  public deleteUser = async (userId: string) => {
    const userRepository = getRepository(User);
    let userToRemove = await userRepository.findOne({
      where: { id: Number(userId) }
    });

    return await userRepository.remove(userToRemove);
  }
}

export default UserService;
