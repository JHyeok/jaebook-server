import { UserService } from "../services/UserService";
import { JsonController, Get } from "routing-controllers";
import { User } from "../entities/User";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    public find(): Promise<User[]> {
        return this.userService.getUsers();
    }
}
