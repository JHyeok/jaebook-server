import { App } from "./app";

try {
    const app = new App();
    app.createExpressServer();
} catch (error) {
    console.log(error);
}
