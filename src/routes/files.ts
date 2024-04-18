import { Hono } from "hono";
import { filesControllers } from "../controllers";

const files = new Hono();

files.post("/upload", ...filesControllers.upload);

files.delete("/delete", ...filesControllers.deleteFile);

export default files;
