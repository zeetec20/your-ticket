import { createFactory } from "hono/factory";
import db from "../db";
import { sign } from "hono/jwt";
import { users } from "../db/schema";
import { authValidations } from "../validations";
import { IResponse } from "../utils/response";

const { createHandlers } = createFactory();

export const login = createHandlers(authValidations.login, async (c) => {
  const { email, password } = c.req.valid("json");
  const errorMessage = c.json(
    {
      error: {
        status: 403,
        message: "Email and password incorrect",
      },
    },
    403
  );

  const user = (await db.query.users
    .findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })
    .execute()) as any;

  console.log({ user, email });
  if (!user) return errorMessage;
  const isValid = await Bun.password.verify(password, user.password);
  if (!isValid) return errorMessage;
  delete user.password;

  const jwt = await sign(user, process.env.JWT_SECRET!);

  return c.json<IResponse>({
    data: user,
    jwt,
  });
});

export const register = createHandlers(authValidations.register, async (c) => {
  const userJson = c.req.valid("json");
  userJson.password = await Bun.password.hash(userJson.password);

  const isExist = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, userJson.email),
  });
  if (isExist) {
    return c.json(
      {
        error: {
          status: 400,
          message: "User is already created",
        },
      },
      400
    );
  }

  const { password, ...user } = (
    await db.insert(users).values(userJson).returning()
  )[0];

  return c.json<IResponse>({
    data: user,
  });
});
