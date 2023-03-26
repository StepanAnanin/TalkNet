import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import ChatController from "../controller/chat-controller";

/**
 *      Handle '/chat' route
 */

const ChatRouter = Router();

ChatRouter.get("/info/:id", authMiddleware, ChatController.getChatInfo);
ChatRouter.get("/create/dialogue", authMiddleware, ChatController.createDialogueChat);
ChatRouter.post("/message/:id", authMiddleware, ChatController.sendMessage);

export default ChatRouter;
