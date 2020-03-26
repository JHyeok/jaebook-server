import { JsonController, Get, Res, HttpCode, Param } from "routing-controllers";
import { Response } from "express";
import { UserService } from "../services/UserService";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @HttpCode(200)
    @Get("/:id")
    @OpenAPI({
        summary: "사용자 정보",
        description: "UserId로 사용자 정보를 반환한다",
        statusCode: "200",
        responses: {
            "400": {
                description: "Bad request",
            },
        },
    })
    public async getOne(@Param("id") id: string, @Res() res: Response) {
        const user = await this.userService.getUsersById(id);

        if (!user) {
            return res
                .status(400)
                .send({ message: "일치하는 사용자가 없습니다." });
        }

        return user;
    }

    @HttpCode(200)
    @Get("/test")
    public async getTest() {
        return {
            message: "안녕하세요.",
        };
    }
}
