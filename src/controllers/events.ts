import { createFactory } from "hono/factory";
import { authenticated } from "../routes/middlewares";
import db from "../db";
import { IResponse } from "../utils/response";
import { eventsValidations } from "../validations";
import { events } from "../db/schema";

const { createHandlers } = createFactory();

export const all = createHandlers(async (c) => {
  const events = await db.query.events.findMany().execute();

  return c.json<IResponse>({
    data: events,
  });
});

export const get = createHandlers(async (c) => {
  const event = await db.query.events
    .findFirst({
      where: (events, { eq }) => eq(events.id, c.req.param("id")),
    })
    .execute();

  return c.json<IResponse>({
    data: event,
  });
});

export const register = createHandlers(
  authenticated,
  eventsValidations.register,
  async (c) => {
    const eventJson = c.req.valid("json");
    const event = (
      await db
        .insert(events)
        .values({ ...eventJson, registered_by: c.get("jwtPayload").id })
        .returning()
    )[0];

    return c.json<IResponse>({
      data: event,
    });
  }
);
