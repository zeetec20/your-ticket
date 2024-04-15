import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { routes } from "./routes";

const server = new Hono();

routes(server);

server.use("*", csrf());

server.onError((error, c) => {
  console.error(error);
  return c.json({}, 500);
});

export default {
  ...server,
  port: process.env.PORT,
};
