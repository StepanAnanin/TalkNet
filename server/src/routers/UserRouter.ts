import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import userController from "../controller/user-controller";

/**
 *      Handle '/user' route
 */

const UserRouter = Router();

UserRouter.post("/sign-up", userController.registrate);

UserRouter.post("/login", userController.login);

UserRouter.post("/logout", userController.logout);

UserRouter.post("/refresh", userController.updateRefreshToken);

UserRouter.get("/activate/:link", userController.activateAccount);

export default UserRouter;
