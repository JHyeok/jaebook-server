import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { createDatabaseConnection } from "./database";
import { env } from "./env";
import { Container } from "typedi";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { SecurityMiddleware } from "./middlewares/SecurityMiddleware";

interface Err extends Error {
    status: number;
    data?: any;
}

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();

        this.setDatabase();
        this.setMiddlewares();
        this.setErrorHandler();
    }

    private async setDatabase() {
        await createDatabaseConnection();
    }

    private setMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private setErrorHandler(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new Error("Not Found") as Err;
            err.status = 404;
            next(err);
        });

        // error handler
        this.app.use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                data: err.data,
            });
        });
    }

    public async createExpressServer() {
        const port: number = env.app.port;

        routingUseContainer(Container);

        this.app = createExpressServer({
            cors: true,
            routePrefix: env.app.apiPrefix,
            controllers: [UserController, AuthController],
            middlewares: [SecurityMiddleware],
        });

        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
