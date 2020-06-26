import express from "express";
import * as Sentry from "@sentry/node";
import { env } from "../env";

/**
 * Sentry를 사용하도록 한다.
 * @param app Express Application
 */
export function useSentry(app: express.Application) {
  Sentry.init({ dsn: env.sentry.dsn });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}
