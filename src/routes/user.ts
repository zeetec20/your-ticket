import { Hono } from "hono";
import authenticated from "./middlewares/authenticated";

const user = new Hono();

user.get("/profile", authenticated, (c) => c.json({}));

user.get("/history", authenticated, (c) => c.json({}));

export default user;
