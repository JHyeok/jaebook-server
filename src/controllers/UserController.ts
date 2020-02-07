import { UserService } from "../services/UserService";
import { JsonController, Get, Param, Body, Post, Put, Delete } from "routing-controllers";
import { User } from "../entities/User";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    public create(@Body() user: User): Promise<User> {
        return this.userService.createUser(user);
    }

    @Get("")
    public getAll(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get("/:id")
    public getOne(@Param("id") id: string): Promise<User> {
        return this.userService.getUsersById(id);
    }

    @Put("/:id")
    public update(@Param("id") id: string, @Body() user: User): Promise<User> {
        return this.userService.updateUser(id, user);
    }

    @Delete("/:id")
    public delete(@Param("id") id: string): Promise<string> {
        return this.userService.deleteUser(id);
    }
}
