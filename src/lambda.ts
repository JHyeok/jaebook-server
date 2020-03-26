import serverless from "serverless-http";
import {
    APIGatewayProxyEvent,
    Context,
    Handler,
    APIGatewayProxyResult,
} from "aws-lambda";
import app from "./app";

const serverlessApp = serverless(app);

export const handler: Handler = async (
    event: APIGatewayProxyEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    const result = await serverlessApp(event, context);
    return result;
};

/*
import * as awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const binaryMimeTypes = [
    "application/json",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
export const handler = async (event, context) =>
    awsServerlessExpress.proxy(server, event, context);
*/
