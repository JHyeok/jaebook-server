import { AuthService } from "../services/AuthService";
import { JsonController, Post, BodyParam, NotFoundError, UseBefore, Get, Res } from "routing-controllers";
import * as jwt from "jsonwebtoken";
import { env } from "../env";
import { User } from "../entities/User";
import { checkJwt } from "../middlewares/checkJwt";
import { Response } from "express";

@JsonController("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new NotFoundError(`User was not found.`);
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        await this.authService.saveRefreshToken(user, refreshToken);

        return {
            token: accessToken,
            refreshToken: refreshToken,
        };
    }

    /**
     * JWT 테스트 API 엔드포인트
     * @param res
     */
    @Get("/protected")
    @UseBefore(checkJwt)
    public async protected(@Res() res: Response) {
        const userEmail = res.locals.jwtPayload.userEmail;
        return `You successfully reached This protected endpoint, ${userEmail}`;
    }

    /**
     * JWT Access Token을 만든다.
     * @param user
     */
    private generateAccessToken(user: User) {
        return jwt.sign({ userId: user.id, userName: user.realName, userEmail: user.email }, env.app.jwtAccessSecret, {
            expiresIn: "30m",
        });
    }

    /**
     * JWT Refresh Token을 만든다.
     * @param user
     */
    private generateRefreshToken(user: User) {
        return jwt.sign({ userId: user.id }, env.app.jwtRefreshSecret, { expiresIn: "14d" });
    }
}
