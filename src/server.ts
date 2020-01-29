import App from "./app";
import * as express from "express";
import databaseConnection from "./database";

const ENV_PATH: string = `config/.env.${process.env.NODE_ENV || "development"}`;
require("dotenv").config({ path: ENV_PATH });

const PORT: number = Number(process.env.PORT) || 3000;
const app: express.Application = new App().app;

databaseConnection
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Express server has started on port ${PORT}`);
        }),
    )
    .catch(console.error);
