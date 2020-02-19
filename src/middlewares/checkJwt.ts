import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { env } from "../env";

/**
 * 헤더에서 토큰을 추출한다.
 * @param req
 */
const extractTokenFromHeader = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
};

/**
 * JWT Token을 체크한다.
 * @param req
 * @param res
 * @param next
 */
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req);
    let jwtPayload;

    // AccessToken 유효성 검사
    try {
        // AccessToken의 유효기간을 체크하고 만료되었음을 알린다
        const tokenExpiresDate = jwt.decode(token)["exp"];
        const nowDate = Math.floor(Date.now() / 1000);
        if (tokenExpiresDate < nowDate) {
            res.status(401).send({ response: "Your token has expired!" });
            return;
        }

        jwtPayload = jwt.verify(token, env.app.jwtAccessSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // 토큰이 유효하지 않은 경우 401 (unauthorized)로 응답
        res.status(401).send({ response: "You should be logged in to access this url" });
        return;
    }

    next();
};
