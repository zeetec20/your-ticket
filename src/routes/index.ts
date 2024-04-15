import { Hono } from "hono";
import { logger } from "hono/logger";
import user from "./user";
import events from "./events";
import auth from "./auth";

export const routes = (app: Hono) => {
  app.use(logger());

  app
    .basePath("/api")
    .route("/auth", auth)
    .route("/user", user)
    .route("/events", events);
};
