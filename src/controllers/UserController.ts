import { UserService } from "../services/UserService";
import { JsonController, Get, Param, Body, Post, Put, Delete, UseBefore, Res } from "routing-controllers";
import { User } from "../entities/User";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * AccessToken으로 현재 사용자 정보를 반환
     * @param res
     */
    @Get("/me")
    @UseBefore(checkAccessToken)
    public getMyProfile(@Res() res: Response) {
        const { userId, userName, userEmail } = res.locals.jwtPayload;

        const userInfo = {
            id: userId,
            realName: userName,
            email: userEmail,
        };

        return {
            userInfo,
        };
    }

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
