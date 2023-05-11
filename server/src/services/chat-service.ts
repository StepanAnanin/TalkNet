import { ObjectId } from "mongodb";
import ChatModel from "../DB/models/Chat";
import HTTPError from "../errors/HTTPError";
import ChatDTO from "../DTO/chat-DTO";
import IChat from "../types/DB/models/Chat";
import ChatMessage from "../types/DB/schemas/ChatMessage";
import { Types } from "mongoose";
import UserModel from "../DB/models/User";

// TODO require decomposition
class ChatService {
    protected createChatDTO(chat: IChat) {
        return new ChatDTO({
            id: chat._id,
            type: chat.type,
            members: chat.members,
            lastMessage: chat.messages.at(-1) ?? null,
            messageAmount: chat.messages.length,
        });
    }

    protected async verifyUserPremission(userID: string, chat: IChat) {
        for (const user of chat.members) {
            if ((user.userID as any) === userID) {
                return false;
            }
        }

        return true;
    }

    public async getChatInfo(chatID: string, userID: string) {
        if (!ObjectId.isValid(chatID)) {
            throw new HTTPError(400, "Requested ID has incorrect format");
        }

        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "Requested ID has incorrect format");
        }

        const chat = await ChatModel.findById(chatID);

        if (!chat) {
            throw new HTTPError(404, "Запрошеный чат не был найден");
        }

        if (!this.verifyUserPremission(userID, chat)) {
            throw new HTTPError(403, "Доступ заблокирован. Недостаточно прав.");
        }

        return this.createChatDTO(chat!);
    }

    public async getUserChatsInfo(userID: string) {
        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "Requested userID has incorrect format");
        }

        const userChats = await ChatModel.find({ members: { $elemMatch: { userID } } });

        if (!userChats) {
            throw new HTTPError(404, "Не удалось найти информацию о чатах пользователя");
        }

        return userChats.map((chat) => this.createChatDTO(chat));
    }

    public async getChatMessages(chatID: string, userID: string) {
        if (!ObjectId.isValid(chatID)) {
            throw new HTTPError(400, "Requested ID has incorrect format");
        }

        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "Requested ID has incorrect format");
        }

        const chat = await ChatModel.findById(chatID);

        if (!chat) {
            throw new HTTPError(404, "Запрошеный чат не был найден");
        }

        if (!this.verifyUserPremission(userID, chat)) {
            throw new HTTPError(403, "Доступ заблокирован. Недостаточно прав.");
        }

        return chat.messages;
    }

    public async createDialogueChat(chatName: string, firstUserID: string, secondUserID: string) {
        if (!ObjectId.isValid(firstUserID)) {
            throw new HTTPError(400, "firstUserID has incorrect format");
        }

        if (!ObjectId.isValid(secondUserID)) {
            throw new HTTPError(400, "secondUserID has incorrect format");
        }

        if (chatName.length > 64) {
            throw new HTTPError(400, "chat name is too long");
        }

        if (chatName.length < 2) {
            throw new HTTPError(400, "chat name is too short");
        }

        const chat = await ChatModel.create({
            name: chatName,
            type: "dialogue",
            members: [{ userID: firstUserID }, { userID: secondUserID }],
        });

        return this.createChatDTO(chat);
    }

    // TODO Require testing
    public async deleteDialogueChat(chatID: string, requesterID: string) {
        if (!ObjectId.isValid(chatID)) {
            throw new HTTPError(400, "chatID has incorrect format");
        }

        const requestedChat = await ChatModel.findOne({ _id: chatID });

        if (!requestedChat) {
            throw new HTTPError(404, "Запрошеный чат не был найден");
        }

        const hasPremission = this.verifyUserPremission(requesterID, requestedChat);

        if (!hasPremission) {
            throw new HTTPError(
                403,
                "У пользователя недостаточно прав для удаления чата. Только один из участников чата может удалить его."
            );
        }

        await ChatModel.deleteOne({ _id: requestedChat._id });
    }

    public async sendMessage(chatID: string, senderID: string, messageText: string, sentDate: number) {
        if (!ObjectId.isValid(chatID)) {
            throw new HTTPError(400, "chatID has incorrect format");
        }

        const requestedChat = await ChatModel.findOne({ _id: chatID });

        if (!requestedChat) {
            throw new HTTPError(404, "Запрошеный чат не был найден");
        }

        const hasPremission = this.verifyUserPremission(senderID, requestedChat);

        if (!hasPremission) {
            throw new HTTPError(403, "Только участники чата могут отправлять в него сообщения.");
        }

        requestedChat.messages.push({
            sentBy: senderID as any,
            data: messageText,
            sentDate,
            readDate: null,
            edited: false,
        } as ChatMessage);

        await requestedChat.save();

        // @ts-ignore
        // BUG be careful with spreading mongoDB objects, it's work incorrectly. Use ".toObject()" method on it to prevent this.
        // This is supposed to be a mongoose problem.
        // https://stackoverflow.com/questions/48014504/es6-spread-operator-mongoose-result-copy
        const messageData: ChatMessage = requestedChat.messages.at(-1)!.toObject();

        return messageData;
    }

    // TODO move all ObjectId validations out from all this methods
    public async updateMessageReadDate(userID: string, chatID: string, messageID: string, newReadDate: number) {
        if (!ObjectId.isValid(userID)) {
            throw new HTTPError(400, "chatID has incorrect format");
        }
        if (!ObjectId.isValid(chatID)) {
            throw new HTTPError(400, "chatID has incorrect format");
        }
        if (!ObjectId.isValid(messageID)) {
            throw new HTTPError(400, "messageID has incorrect format");
        }

        const targetedUser = await UserModel.findById(userID);
        const targetedChat = await ChatModel.findById(chatID);

        if (!targetedUser) {
            throw new HTTPError(404, "Failed to find user");
        }

        if (!targetedChat) {
            throw new HTTPError(404, "Failed to find requested chat");
        }

        const targetedMessage = targetedChat.messages.find((message) => message._id.toString() === messageID);

        if (!targetedMessage) {
            throw new HTTPError(404, "Failed to find requested message");
        }

        const targetedMessageIndex = targetedChat.messages.indexOf(targetedMessage);

        const userChatMember = targetedChat.members.find((chatMember, i) => {
            return chatMember.userID.toString() === targetedUser._id.toString();
        });

        if (!userChatMember) {
            throw new HTTPError(404, "Failed to find chat member");
        }

        userChatMember.lastReadMessageIndex = targetedMessageIndex;

        targetedChat.messages.forEach((message, index) => {
            if (index > targetedMessageIndex) {
                return;
            }

            message.readDate = newReadDate;
        });

        await targetedChat.save();

        return { updatedMessage: targetedChat.messages[targetedMessageIndex], updatedMessageIndex: targetedMessageIndex };
    }
}

export default new ChatService();
