import { Hono } from "hono";
import { eventsControllers } from "../controllers";

const events = new Hono();

events.get("/", ...eventsControllers.all);

events.get("/:id", ...eventsControllers.get);

events.get("/:id/guest", ...eventsControllers.getWithGuest);

events.post("/register", ...eventsControllers.register);

events.post("/guest/register", ...eventsControllers.guestRegister);

events.post("/guest/unregister", ...eventsControllers.guestUnregister);

events.post("/guest/attend", (c) => c.json({}));

export default events;
