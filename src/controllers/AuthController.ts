import { AuthService } from "../services/AuthService";
import { JsonController, Post, BodyParam, NotFoundError, UseBefore, Get, Res } from "routing-controllers";
import { checkAccessToken, generateAccessToken, generateRefreshToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";

@JsonController("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * 사용자 로그인
     * @param email 이메일
     * @param password 비밀번호
     */
    @Post("/login")
    public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new NotFoundError(`User was not found.`);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await this.authService.saveRefreshToken(user, refreshToken);

        return {
            realName: user.realName,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    /**
     * JWT 테스트 API 엔드포인트
     * @param res
     */
    @Get("/protected")
    @UseBefore(checkAccessToken)
    public async protected(@Res() res: Response) {
        const userEmail = res.locals.jwtPayload.userEmail;
        return `You successfully reached This protected endpoint, ${userEmail}`;
    }
}
