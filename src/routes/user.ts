import { Hono } from "hono";
import { authenticated } from "./middlewares";
import { userControllers } from "../controllers";

const user = new Hono();

user.get("/profile", ...userControllers.profile);

user.get("/history", ...userControllers.history);

export default user;
