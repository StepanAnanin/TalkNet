import { Router } from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middlewares/auth-middleware";

/**
 *      Handle '/user' route
 */

const UserRouter = Router();

UserRouter.post("/sign-up", userController.registrate);

UserRouter.post("/login", userController.login);

UserRouter.post("/logout", userController.logout);

UserRouter.post("/refresh", userController.updateRefreshToken);

UserRouter.post("/friend-requests", userController.sendFriendRequest);

UserRouter.patch("/friend-requests/accept", userController.acceptFriendRequest);

UserRouter.get("/:id/chats", userController.getUserChats);

UserRouter.get("/activate/:link", userController.activateAccount);

export default UserRouter;
