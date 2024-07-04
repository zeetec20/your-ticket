import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { createFactory } from "hono/factory";
import { events, guests } from "../db/schema";
import { z } from "zod";
import { IMAGE_TYPES } from "../constants/file";

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

export const attend = createMiddleware(
  zValidator(
    "form",
    z.object({
      ticket: z
        .any()
        .refine(
          (files) => files?.size <= 1024 * 1024 * 2.5,
          "max image is 2.5mb"
        )
        .refine(
          (files) => IMAGE_TYPES.includes(files?.name?.split(".").pop()),
          `only support format ${IMAGE_TYPES.join(", ")}`
        ),
    })
  )
);
