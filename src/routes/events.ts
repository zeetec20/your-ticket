import { Hono } from "hono";

const events = new Hono();

events.get("/", (c) => c.json([]));

events.get("/:uuid", (c) => c.json({}));

events.post("/register", (c) => c.json({}));

events.post("/guest/register", (c) => c.json({}));

events.post("/guest/unregister", (c) => c.json({}));

events.post("/attend", (c) => c.json({}));

export default events;
