import { UserService } from "../services/UserService";
import { JsonController, Get, Param, UseBefore, Res, HttpCode } from "routing-controllers";
import { User } from "../entities/User";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @HttpCode(200)
    @Get("/me")
    @OpenAPI({
        summary: "사용자 정보",
        description: "AccessToken으로 사용자 정보를 반환한다",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public getMyProfile(@Res() res: Response) {
        const { userId, userName, userEmail } = res.locals.jwtPayload;

        const user = {
            id: userId,
            realName: userName,
            email: userEmail,
        };

        return {
            user,
        };
    }

    @HttpCode(200)
    @Get("/:id")
    @OpenAPI({
        summary: "사용자 정보",
        description: "UserId로 사용자 정보를 반환한다",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    public getOne(@Param("id") id: string): Promise<User> {
        return this.userService.getUsersById(id);
    }
}
