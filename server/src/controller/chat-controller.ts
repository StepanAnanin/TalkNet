import type { Request, Response, NextFunction } from "express";
import HTTPError from "../errors/HTTPError";
import ChatService from "../services/chat-service";
import validateRequest from "../lib/validators/validateRequest";

class ChatController {
    public async getChatInfo(req: Request<{ id: string }>, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const requestedID = req.params.id;
        const userID = req.body.userID;

        if (typeof userID !== "string") {
            res.status(400).json({ message: "user ID is missing" });
            return;
        }

        if (!requestedID) {
            res.status(400).json({ message: "Chat ID is missing" });
            return;
        }

        try {
            const chatInfo = await ChatService.getChatInfo(requestedID, userID);

            res.status(200).json(chatInfo);
        } catch (err: any) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async getChatMessages(req: Request<{ id: string }>, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const requestedID = req.params.id;
        const userID = req.body.userID;

        if (typeof userID !== "string") {
            res.status(400).json({ message: "user ID is missing" });
            return;
        }

        if (!requestedID) {
            res.status(400).json({ message: "Chat ID is missing" });
            return;
        }

        try {
            const chatMessages = await ChatService.getChatMessages(requestedID, userID);

            res.status(200).json(chatMessages);
        } catch (err: any) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async createDialogueChat(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const chathName: string = req.body.chatName;
        const firstUserID: string = req.body.firstUserID;
        const secondUserID: string = req.body.secondUserID;

        const validationResult = validateRequest(req.body, [
            { key: "chatName", type: "string" },
            { key: "firstUserID", type: "string" },
            { key: "secondUserID", type: "string" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json(validationResult.message);
            return;
        }

        try {
            const chat = await ChatService.createDialogueChat(chathName, firstUserID, secondUserID);

            res.status(200).json(chat);
        } catch (err) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async deleteDialogueChat(req: Request, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const chatID: string = req.body.chatID;
        const requesterID: string = req.body.requesterID;

        const validationResult = validateRequest(req.body, [
            { key: "chatID", type: "string" },
            { key: "requesterID", type: "string" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json(validationResult.message);
            return;
        }

        try {
            // const chat = await ChatService.deleteDialogueChat(chatID, requesterID);

            res.status(200).json({ message: "Сообщения удалены" });
        } catch (err) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }

    public async sendMessage(req: Request<{ id: string }>, res: Response) {
        if (res.headersSent) {
            return;
        }

        res.setHeader("Accept-Charset", "utf-8");

        const chatID = req.params.id;
        const senderID: string = req.body.senderID;
        const messageText: string = req.body.messageText;
        const sentDate: number = req.body.sentDate;

        const validationResult = validateRequest(req.body, [
            { key: "senderID", type: "string" },
            { key: "messageText", type: "string" },
            { key: "sentDate", type: "number" },
        ]);

        if (!validationResult.ok) {
            res.status(400).json(validationResult.message);
            return;
        }

        if (!chatID) {
            res.status(400).json({ message: "Chat ID is missing" });
            return;
        }

        try {
            const message = await ChatService.sendMessage(chatID, senderID, messageText, sentDate);

            res.status(200).json({ chatID, ...message });
        } catch (err: any) {
            if (err instanceof HTTPError) {
                res.status(err.errorCode).json({ message: err.message });
                return;
            }

            res.status(500).json({ message: "Что-то пошло не так..." });
        }
    }
}

export default new ChatController();
