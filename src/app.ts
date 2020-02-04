import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import apiRouter from "./routes/Api";
import { createDatabaseConnection } from "./database";
import { env } from "./env";

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
        this.setRoutes();
        this.setErrorHandler();
    }

    private async setDatabase() {
        await createDatabaseConnection();
    }

    private setRoutes(): void {
        this.app.use(`/${env.app.apiPrefix}`, apiRouter);
    }

    private setMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
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

    public async runExpressServer() {
        const port: number = env.app.port;

        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
