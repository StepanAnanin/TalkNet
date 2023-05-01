export default interface User {
    id: string;
    name: string;
    surname: string;
    patronymic: string | null;
    email: string;
    isActivated: boolean;
    lastPasswordChange: number;
    isEmailChangeInProcess: boolean;
    isAccountDeletionInProcess: boolean;

    // To be correct it's not "string[]" but "ObjectId[]",
    // but this doesn't affect anything cuz ObjectId is one kind of string.
    friends: string[];
    incomingFriendRequests: string[];
    outcomingFriendRequests: string[];
    blackList: string[];
}
