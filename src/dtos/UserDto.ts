import { IsNotEmpty, Length, IsEmail } from "class-validator";
import { User } from "../entities/User";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 50)
  public realName: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  public toEntity(): User {
    const { realName, email, password } = this;

    const user = new User();
    user.realName = realName;
    user.email = email;
    user.password = password;

    return user;
  }
}

export class LoginUserDto {
  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;
}

export class ResponseUserDto {
  public id: string;

  public realName: string;

  public email: string;
}
