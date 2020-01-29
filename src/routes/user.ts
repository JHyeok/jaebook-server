import { Router } from "express";
import Container from "typedi";
import { UserController } from "../controllers";

const router = Router();
const controller = Container.get(UserController);

router.get("/", controller.getUsers);
router.get("/:userId", controller.getUserById);
router.post("/", controller.createUser);
router.delete("/:userId", controller.deleteUser);

export default router;
