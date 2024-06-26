import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { createFactory } from "hono/factory";
import { events } from "../db/schema";

const { createMiddleware } = createFactory();

export const register = createMiddleware(
  zValidator(
    "json",
    createInsertSchema(events, {
      registered_by: (s) => s.registered_by.optional(),
    })
  )
);
