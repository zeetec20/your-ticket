import { createFactory } from "hono/factory";

const { createHandlers } = createFactory();

export const upload = createHandlers(async (c) => {
  const data = await c.req.parseBody();
  console.log(data["file"]);
});
