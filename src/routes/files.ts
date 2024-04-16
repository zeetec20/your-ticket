import { Hono } from "hono";

const files = new Hono();

files.post("/upload", (c) => c.json({}));

files.delete("/delete", (c) => c.json({}));

export default files;
