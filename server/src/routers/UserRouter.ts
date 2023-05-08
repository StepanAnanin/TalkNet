import { Router } from "express";
import UserController from "../controller/user-controller";
import authMiddleware from "../middlewares/auth-middleware";

/**
 *      Handle '/user' route
 */

const UserRouter = Router();

UserRouter.post("/sign-up", UserController.registrate);

UserRouter.post("/login", UserController.login);

UserRouter.post("/logout", UserController.logout);

UserRouter.post("/refresh", UserController.updateRefreshToken);

UserRouter.post("/friend-requests", authMiddleware, UserController.sendFriendRequest);

UserRouter.patch("/change/email", authMiddleware, UserController.changeEmail);

UserRouter.patch("/change/password", authMiddleware, UserController.changePassword);

UserRouter.patch("/change/fullname", authMiddleware, UserController.changeFullname);

UserRouter.patch("/change/avatar", authMiddleware, UserController.changeAvatar);

UserRouter.patch("/friend-requests/accept", authMiddleware, UserController.acceptFriendRequest);

UserRouter.patch("/friend-requests/decline", authMiddleware, UserController.declineFriendRequest);

UserRouter.get("/friend-requests", authMiddleware, UserController.getParsedUserFriendRequests);

UserRouter.get("/friends", authMiddleware, UserController.getParsedUserFriends);

UserRouter.get("/:id/chats", UserController.getUserChats);

UserRouter.get("/activate/:link", UserController.activateAccount);

export default UserRouter;
