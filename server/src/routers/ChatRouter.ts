import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import ChatController from "../controller/chat-controller";
import chatController from "../controller/chat-controller";

/**
 *      Handle '/chat' route
 */

const ChatRouter = Router();

ChatRouter.get("/info/:id", ChatController.getChatInfo);
ChatRouter.post("/messages/:id", authMiddleware, chatController.getChatMessages); // POST, cuz need to pass accessToken (GET don't have access to it)
ChatRouter.post("/create/dialogue", authMiddleware, ChatController.createDialogueChat);
ChatRouter.post("/message/:id", authMiddleware, ChatController.sendMessage);

export default ChatRouter;
