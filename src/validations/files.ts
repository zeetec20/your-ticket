import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

const { createMiddleware } = createFactory();

export const deleteFile = createMiddleware(
  zValidator(
    "json",
    z.object({
      file: z.string(),
    })
  )
);
