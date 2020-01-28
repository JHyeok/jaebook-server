import { Router } from "express";
import user from "./user";

const routes = Router();

routes.use("/users", user);

export default routes;
