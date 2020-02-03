import { App } from "./app";
import { env } from "./env";

const PORT: number = env.app.port;

try {
    const app = new App();
    app.runExpressServer(PORT);
} catch (error) {
    console.log(error);
}
