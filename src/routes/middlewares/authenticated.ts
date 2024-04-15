import { Context, Next } from "hono";
import { jwt } from "hono/jwt";

const authenticated = async (c: Context, next: Next) =>
  jwt({ secret: process.env.JWT_SECRET! })(c, next).catch(() =>
    c.json(
      {
        error: {
          status: 403,
          message: "Unauthorized",
        },
      },
      403
    )
  );

export default authenticated;
