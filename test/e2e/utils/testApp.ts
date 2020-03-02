import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { Container } from "typedi";
import { useContainer as routingUseContainer, useExpressServer } from "routing-controllers";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";

routingUseContainer(Container);
const app = express();

async function setDatabase() {
    await createMemoryDatabase();
}

function setExpress() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    useExpressServer(app, {
        routePrefix: "/api",
        controllers: [__dirname + "/../../../src/controllers/*{.ts,.js}"],
    });
}

setDatabase().then(setExpress);

export default app;
