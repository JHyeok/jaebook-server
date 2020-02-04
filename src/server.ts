import { App } from "./app";

try {
    const app = new App();
    app.runExpressServer();
} catch (error) {
    console.log(error);
}
