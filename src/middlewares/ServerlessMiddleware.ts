import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import * as awsServerlessExpressMiddleware from "aws-serverless-express/middleware";

@Middleware({ type: "before" })
export class ServerlessMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): any {
        awsServerlessExpressMiddleware.eventContext()(req, res, next);
    }
}
