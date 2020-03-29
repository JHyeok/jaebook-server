import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import helmet from "helmet";

/**
 * Express 보안을 위한 Helmet을 적용하도록 하는 전역 미들웨어
 */
@Middleware({ type: "before" })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): any {
    return helmet()(req, res, next);
  }
}
