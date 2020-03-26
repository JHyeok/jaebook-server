import app from "./app";
import { env } from "./env";
import { logger } from "./utils/Logger";

try {
    const port: number = env.app.port;
    app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
} catch (error) {
    logger.error(error);
}
