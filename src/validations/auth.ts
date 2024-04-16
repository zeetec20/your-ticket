import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { users } from "../db/schema";

const { createMiddleware } = createFactory();

export const login = createMiddleware(
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
);

export const register = createMiddleware(
  zValidator(
    "json",
    createInsertSchema(users, {
      email: (s) => s.email.email(),
    })
  )
);
