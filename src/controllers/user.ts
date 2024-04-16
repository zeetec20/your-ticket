import { createFactory } from "hono/factory";
import db from "../db";
import { authenticated } from "../routes/middlewares";

const { createHandlers } = createFactory();

export const profile = createHandlers(authenticated, async (c) => {
  const userJwt = c.get("jwtPayload");
  const user = await db.query.users
    .findFirst({
      columns: {
        password: false,
      },
      where: (users, { eq }) => eq(users.id, userJwt.id),
    })
    .execute();

  return c.json({
    data: user,
  });
});

export const history = createHandlers(authenticated, async (c) => {
  return c.json({});
});
