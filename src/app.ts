import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { createDatabaseConnection } from "./database";
import { Container } from "typedi";
import {
    useContainer as routingUseContainer,
    useExpressServer,
} from "routing-controllers";
import { routingControllerOptions } from "./utils/RoutingConfig";
import { useSwagger } from "./utils/Swagger";
import morgan from "morgan";
import { logger, stream } from "./utils/Logger";
import { useSentry } from "./utils/Sentry";

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setDatabase();
        this.setMiddlewares();
        this.setRouting();
    }

    private async setDatabase() {
        try {
            await createDatabaseConnection();
        } catch (error) {
            logger.error(error);
        }
    }

    private setMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(morgan("combined", { stream }));
    }

    private setRouting() {
        try {
            this.app.get(
                "/hello",
                (req: express.Request, res: express.Response) => {
                    return res.json({ message: "Hello" });
                },
            );
            routingUseContainer(Container);
            useExpressServer(this.app, routingControllerOptions);
            useSwagger(this.app);
            useSentry(this.app);
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new App().app;
