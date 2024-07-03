import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { createFactory } from "hono/factory";
import { events, guests } from "../db/schema";
import { z } from "zod";

const { createMiddleware } = createFactory();

export const register = createMiddleware(
  zValidator(
    "json",
    createInsertSchema(events, {
      registeredBy: (s) => s.registeredBy.optional(),
    })
  )
);

export const guestRegister = createMiddleware(
  zValidator(
    "json",
    createInsertSchema(guests, {
      code: (s) => s.code.optional(),
    })
  )
);

export const guestUnregister = createMiddleware(
  zValidator(
    "json",
    z.object({
      id: z.string(),
    })
  )
);
