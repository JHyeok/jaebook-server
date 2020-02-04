import { Router } from "express";
import Container from "typedi";
import { UserController } from "../controllers/UserController";

const apiRouter = Router();
const userController = Container.get(UserController);

/**
 * Users API 라우터
 */
apiRouter.get("/users", userController.getUsers);
apiRouter.get("/users/:userId", userController.getUserById);
apiRouter.post("/users", userController.createUser);
apiRouter.delete("/users/:userId", userController.deleteUser);

export default apiRouter;
