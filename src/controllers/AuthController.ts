import { AuthService } from "../services/AuthService";
import { JsonController, Post, BodyParam, NotFoundError } from "routing-controllers";
import * as jwt from "jsonwebtoken";
import { env } from "../env";
import { User } from "../entities/User";

@JsonController("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new NotFoundError(`User was not found.`);
        }

        const token = this.generateToken(user);
        return token;
    }

    /**
     * JWT Token을 만든다.
     * @param user
     */
    private generateToken(user: User) {
        return jwt.sign({ userId: user.id, userEmail: user.email }, env.app.jwtSecret, { expiresIn: "1h" });
    }
}
