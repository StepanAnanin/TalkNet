// By default it's must by the biggest positive number.
// (it's needed for all other numbers to be less then it, see @1)
let lowestIndex = Infinity;

let handlerTimeout: NodeJS.Timeout;

const handlerTimeoutDelay = 500; // ms

/**
 * `handler` passed to this function will be called only for latest message.
 * This `handler` also is throttled for 1 second.
 */
export default function callThrottledMessageReadUpdateHandler(messageIndex: number, handler: () => void | Promise<void>) {
    if (messageIndex < 0) {
        throw new RangeError("messageIndex must be positive number");
    }

    // @1
    if (messageIndex > lowestIndex) {
        return;
    }

    clearTimeout(handlerTimeout);

    lowestIndex = messageIndex;

    handlerTimeout = setTimeout(() => handler(), handlerTimeoutDelay);
}
