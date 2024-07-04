import { createFactory } from "hono/factory";
import { authenticated } from "../routes/middlewares";
import db from "../db";
import { IResponse } from "../utils/response";
import { eventsValidations } from "../validations";
import { events, guests } from "../db/schema";
import {
  createCodeGuest,
  createQrGuest,
  eventNormalize,
  getGuestQRPath,
  guestNormalize,
} from "../utils/event";
import { eq } from "drizzle-orm";
import { unlink } from "node:fs/promises";
import Jimp from "jimp";
import jsQR from "jsqr";

const { createHandlers } = createFactory();

export const all = createHandlers(async (c) => {
  const events = await db.query.events.findMany().execute();
  const eventsNormalized = events.map(eventNormalize);

  return c.json<IResponse>({
    data: eventsNormalized,
  });
});

export const get = createHandlers(async (c) => {
  const event = await db.query.events
    .findFirst({
      where: (events, { eq }) => eq(events.id, c.req.param("id")),
    })
    .execute()
    .catch(() => null);
  if (!event) {
    return c.json(
      {
        error: {
          status: 400,
          message: "event is not exist",
        },
      },
      400
    );
  }
  const eventNormalized = eventNormalize(event);

  return c.json<IResponse>({
    data: eventNormalized,
  });
});

export const getWithGuest = createHandlers(authenticated, async (c) => {
  const id = c.get("jwtPayload").id;
  const event = await db.query.events
    .findFirst({
      where: (events, { eq }) => eq(events.id, c.req.param("id")),
      with: {
        guests: true,
      },
    })
    .execute()
    .catch(() => null);
  if (!event) {
    return c.json(
      {
        error: {
          status: 400,
          message: "event is not exist",
        },
      },
      400
    );
  }
  if (event.registeredBy !== id) {
    return c.json(
      {
        error: {
          status: 400,
          message: "you can't access data guest this event",
        },
      },
      400
    );
  }
  event.guests = event.guests.map(guestNormalize);
  const eventNormalized = eventNormalize(event);

  return c.json<IResponse>({
    data: eventNormalized,
  });
});

export const register = createHandlers(
  authenticated,
  eventsValidations.register,
  async (c) => {
    const {
      title,
      organizer,
      description,
      image,
      date,
      days,
      timeEnd,
      timeStart,
    } = c.req.valid("json");
    const event = (
      await db
        .insert(events)
        .values({
          title,
          organizer,
          description,
          image,
          date,
          days,
          timeEnd,
          timeStart,
          registeredBy: c.get("jwtPayload").id,
        })
        .returning()
    )[0];

    return c.json<IResponse>({
      data: event,
    });
  }
);

export const guestRegister = createHandlers(
  authenticated,
  eventsValidations.guestRegister,
  async (c) => {
    const { name, eventId } = c.req.valid("json");
    const event = await db.query.events.findFirst({
      where: (events, { eq }) => eq(events.id, eventId),
    });
    if (!event) {
      return c.json(
        {
          error: {
            status: 400,
            message: "event is not exist",
          },
        },
        400
      );
    }
    const code = createCodeGuest(event);

    const guest = (
      await db.insert(guests).values({ name, eventId, code }).returning()
    )[0];
    const guestNormalized = guestNormalize(guest);

    return c.json<IResponse>({
      data: guestNormalized,
    });
  }
);

export const guestUnregister = createHandlers(
  authenticated,
  eventsValidations.guestUnregister,
  async (c) => {
    const { id } = c.req.valid("json");
    const guest = await db.query.guests
      .findFirst({
        where: (guests, { eq }) => eq(guests.id, id),
      })
      .execute()
      .catch(() => null);
    if (!guest) {
      return c.json(
        {
          error: {
            status: 400,
            message: "Guest is not exist",
          },
        },
        400
      );
    }
    const path = getGuestQRPath(guest);
    await db.delete(guests).where(eq(guests.id, id)).execute();
    await unlink(path).catch(() => null);

    return c.json<IResponse>({
      data: null,
    });
  }
);

export const attend = createHandlers(
  authenticated,
  eventsValidations.attend,
  async (c) => {
    const { ticket } = c.req.valid("form");
    const buffer = await (ticket as Blob).arrayBuffer();
    const image = await Jimp.read(Buffer.from(buffer));
    const decodedQr = jsQR(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height
    );
    if (!decodedQr) {
      return c.json(
        {
          error: {
            status: 400,
            message: "ticket is invalid",
          },
        },
        400
      );
    }
    const id: string = await new Promise((resolve) => {
      try {
        const decode = atob(decodedQr.data);
        resolve(decode);
      } catch (_) {
        resolve("");
      }
    });
    const guest = await db.query.guests
      .findFirst({
        where: (guests, { eq }) => eq(guests.id, id),
        with: {
          event: true,
        },
      })
      .execute()
      .catch(() => null);
    if (!guest) {
      return c.json(
        {
          error: {
            status: 400,
            message: "ticket is invalid",
          },
        },
        400
      );
    }
    if (eventNormalize(guest.event).isDone) {
      return c.json(
        {
          error: {
            status: 400,
            message: "event was done, ticket expired",
          },
        },
        400
      );
    }
    const guestUpdated = (
      await db
        .update(guests)
        .set({ attendedAt: new Date() })
        .where(eq(guests.id, id))
        .returning()
    )?.[0];

    const guestNormalized = guestNormalize(guestUpdated);
    return c.json<IResponse>({ data: guestNormalized });
  }
);
