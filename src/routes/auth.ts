import { Hono } from "hono";

const auth = new Hono();

auth.post("/login", (c) => c.json({}));

auth.post("/register", (c) => c.json({}));

export default auth;
