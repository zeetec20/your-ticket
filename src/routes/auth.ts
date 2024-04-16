import { Hono } from "hono";
import { authControllers } from "../controllers";

const auth = new Hono();

auth.post("/login", ...authControllers.login);

auth.post("/register", ...authControllers.register);

export default auth;
