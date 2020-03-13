import { AuthService } from "../services/AuthService";
import { JsonController, Post, BodyParam, UseBefore, Get, Res, Body, NotFoundError } from "routing-controllers";
import {
    checkAccessToken,
    checkRefreshToken,
    generateAccessToken,
    generateRefreshToken,
} from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../entities/User";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/auth")
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Post("/login")
    @OpenAPI({
        description: "사용자 로그인",
    })
    public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            return {
                error: true,
                message: "유효하지 않은 사용자 이메일/비밀번호 입니다.",
            };
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await this.authService.saveRefreshToken(user, refreshToken);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    @Post("/register")
    @OpenAPI({
        description: "사용자 회원가입",
    })
    public async register(@Body() user: User) {
        const isDuplicateUser = await this.userService.isDuplicateUser(user.email);

        if (isDuplicateUser) {
            return {
                error: true,
                message: "이미 사용 중인 이메일입니다.",
            };
        }

        const newUser = await this.userService.createUser(user);

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        await this.authService.saveRefreshToken(newUser, refreshToken);

        const userInfo = {
            id: newUser.id,
            realName: newUser.realName,
            email: newUser.email,
        };

        return {
            user: userInfo,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    @Post("/token/refresh")
    @OpenAPI({
        description: "RefreshToken을 이용해서 AccessToken을 재발급(새로고침)",
    })
    @UseBefore(checkRefreshToken)
    public async refreshToken(@Res() res: Response) {
        const userId = res.locals.jwtPayload.userId;
        const refreshToken = res.locals.token;

        const user = await this.authService.validateUserToken(userId, refreshToken);

        if (!user) {
            throw new NotFoundError(`유저 정보와 RefreshToken이 일치하지 않습니다.`);
        }

        const accessToken = generateAccessToken(user);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    @Get("/protected")
    @OpenAPI({
        description: "JWT 테스트 API 엔드포인트",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public async protected(@Res() res: Response) {
        const userEmail = res.locals.jwtPayload.userEmail;
        return `JWT 인증테스트에 통과!, ${userEmail}`;
    }
}
