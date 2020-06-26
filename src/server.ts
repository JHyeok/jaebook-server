import { App } from "./app";
import { env } from "./env";
import { logger } from "./utils/Logger";

try {
  const app = new App();
  const port: number = env.app.port;

  app.createExpressServer(port);
} catch (error) {
  logger.error(error);
}
