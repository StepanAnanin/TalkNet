import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import ChatController from "../controller/chat-controller";
import UserController from "../controller/user-controller";

/**
 *      Handle '/search' route
 */

const ChatRouter = Router();

// ChatRouter.get("/chat", ChatController.);
ChatRouter.get("/user", UserController.searchForUser);
// ChatRouter.get("/community", );

export default ChatRouter;
