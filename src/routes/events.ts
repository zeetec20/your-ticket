import { Hono } from "hono";
import { eventsControllers } from "../controllers";

const events = new Hono();

events.get("/", ...eventsControllers.all);

events.get("/:uuid", (c) => c.json({}));

events.post("/register", ...eventsControllers.register);

events.post("/guest/register", (c) => c.json({}));

events.post("/guest/unregister", (c) => c.json({}));

events.post("/attend", (c) => c.json({}));

export default events;
