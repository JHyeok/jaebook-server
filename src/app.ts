import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { createDatabaseConnection } from "./database";
import { env } from "./env";
import { Container } from "typedi";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { SecurityMiddleware } from "./middlewares/SecurityMiddleware";

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setDatabase();
        this.setMiddlewares();
    }

    private async setDatabase() {
        await createDatabaseConnection();
    }

    private setMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
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
