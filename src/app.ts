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
  }

  /**
   * 데이터베이스를 세팅한다.
   */
  private async setDatabase(): Promise<void> {
    try {
      await createDatabaseConnection();
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 미들웨어를 세팅한다.
   */
  private setMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(morgan("combined", { stream }));
  }

  /**
   * Express를 시작한다.
   * @param port 포트
   */
  public async createExpressServer(port: number): Promise<void> {
    try {
      routingUseContainer(Container);
      useExpressServer(this.app, routingControllerOptions);
      useSwagger(this.app);
      useSentry(this.app);

      this.app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
