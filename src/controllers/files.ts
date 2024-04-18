import { createFactory } from "hono/factory";
import { IResponse } from "../utils/response";
import { publicPathToUrl } from "../utils/files";
import { filesValidations } from "../validations";
import { unlink } from "node:fs/promises";
import db from "../db";

const { createHandlers } = createFactory();

export const upload = createHandlers(async (c) => {
  const data = await c.req.parseBody();
  const file = data["file"] as Blob;
  const name = `public/storage/${crypto.randomUUID()}.${file.name
    .split(".")
    .pop()}`;

  try {
    await Bun.write(name, file);
    return c.json<IResponse>({
      data: {
        file: file.name,
        url: publicPathToUrl(name),
      },
    });
  } catch (error) {
    return c.json<IResponse>(
      {
        error: {
          status: 400,
          message: (error as Error).message,
        },
      },
      400
    );
  }
});

export const deleteFile = createHandlers(
  filesValidations.deleteFile,
  async (c) => {
    const path = c.req.valid("json").file;
    const event = await db.query.events
      .findFirst({
        where: (events, { eq }) => eq(events.image, path),
      })
      .execute();

    if (event) {
      return c.json<IResponse>(
        {
          error: {
            status: 400,
            message: "Can't delete image when is used in event",
          },
        },
        400
      );
    }

    try {
      await unlink(path);

      return c.json<IResponse>({
        data: path,
      });
    } catch (error) {
      return c.json<IResponse>(
        {
          error: {
            status: 400,
            message: (error as Error).message,
          },
        },
        400
      );
    }
  }
);
