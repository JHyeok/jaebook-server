import { App } from "./app";
import { logger } from "./utils/Logger";

try {
    const app = new App();
    app.createExpressServer();
} catch (error) {
    logger.error(error);
}
