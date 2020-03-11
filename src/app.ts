import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { createDatabaseConnection } from "./database";
import { env } from "./env";
import { Container } from "typedi";
import { useContainer as routingUseContainer, useExpressServer } from "routing-controllers";
import { routingControllerOptions } from "./utils/RoutingConfig";
import { useSwagger } from "./utils/Swagger";

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
        useExpressServer(this.app, routingControllerOptions);
        useSwagger(this.app);

        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
