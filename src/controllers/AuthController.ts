import { AuthService } from "../services/AuthService";
import { JsonController, Post, BodyParam, UseBefore, Get, Res, Body } from "routing-controllers";
import { checkAccessToken, generateAccessToken, generateRefreshToken } from "../middlewares/AuthMiddleware";
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
                code: "ERR_LOGIN_EMAIL_PASSWORD",
                message: "유효하지 않은 사용자 이메일/비밀번호 입니다.",
            };
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await this.authService.saveRefreshToken(user, refreshToken);

        const userInfo = {
            id: user.id,
            realName: user.realName,
            email: user.email,
        };

        return {
            userInfo,
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
                code: "ERR_REGISTER_DUPLICATE_EMAIL",
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
            userInfo,
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
        return `You successfully reached This protected endpoint, ${userEmail}`;
    }
}
