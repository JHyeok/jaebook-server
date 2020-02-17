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
    // Authorization 헤더에서 JWT 토큰을 가져옴
    const token = extractTokenFromHeader(req);
    let jwtPayload;

    // 토큰을 확인하고 데이터를 얻음
    try {
        jwtPayload = jwt.verify(token, env.app.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // 토큰이 유효하지 않은 경우 401 (unauthorized)로 응답
        res.status(401).send({ response: "You should be logged in to access this url" });
        return;
    }

    // 토큰은 1시간 동안 유효하며, 모든 요청에 대해 새 토큰을 보내야 한다
    const { userId, userEmail } = jwtPayload;
    const newToken = jwt.sign({ userId, userEmail }, env.app.jwtSecret, { expiresIn: "1h" });
    res.setHeader("Authorization", "Bearer " + newToken);

    next();
};
