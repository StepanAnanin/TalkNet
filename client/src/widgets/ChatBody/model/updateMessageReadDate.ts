import TalkNetAPI from "../../../shared/api/TalkNetAPI";

// By default it's must by the biggest positive number.
// (it's needed for all other numbers to be less then it, see @mark_1)
let lowestIndex = Infinity;

let callbackTimeout: NodeJS.Timeout;

function callbackx(messageID: string) {
    console.log(lowestIndex);
}

// TODO this won't work correctly, need to use websokect...
async function callback(chatID: string, messageID: string) {
    try {
        await TalkNetAPI.patch(`/chat/messages/${chatID}/read-date`, {
            newReadDate: Date.now(),
            messageID,
        });
    } catch (err) {
        console.log(`Failed to update message read date. (message id: ${messageID})`);
        console.error(err);
    }
}

export default function updateMessageReadDate(chatID: string, messageID: string, messageIndex: number) {
    // @mark_1
    if (messageIndex > lowestIndex) {
        return;
    }

    clearTimeout(callbackTimeout);

    lowestIndex = messageIndex;

    callbackTimeout = setTimeout(() => callback(chatID, messageID), 1000);
}
