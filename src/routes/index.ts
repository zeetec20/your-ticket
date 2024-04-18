import { Hono } from "hono";
import { logger } from "hono/logger";
import user from "./user";
import events from "./events";
import auth from "./auth";
import { serveStatic } from "@hono/node-server/serve-static";
import files from "./files";

export const routes = (app: Hono) => {
  app.use(logger());

  app
    .use("/public/*", serveStatic({ root: "./" }))
    .basePath("/api")
    .route("/auth", auth)
    .route("/user", user)
    .route("/events", events)
    .route("/files", files);
};
