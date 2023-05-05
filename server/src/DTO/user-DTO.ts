export interface UserDTOModel {
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

export default class UserDTO {
    public id: string;
    public name: string;
    public surname: string;
    public patronymic: string | null;
    public email: string;
    public isActivated: boolean;
    public lastPasswordChange: number;
    public isEmailChangeInProcess: boolean;
    public isAccountDeletionInProcess: boolean;
    public friends: string[];
    public incomingFriendRequests: string[];
    public outcomingFriendRequests: string[];
    public blackList: string[];

    constructor(model: UserDTOModel) {
        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.lastPasswordChange = model.lastPasswordChange;
        this.isEmailChangeInProcess = model.isEmailChangeInProcess;
        this.isAccountDeletionInProcess = model.isAccountDeletionInProcess;
        this.friends = model.friends;
        this.incomingFriendRequests = model.incomingFriendRequests;
        this.outcomingFriendRequests = model.outcomingFriendRequests;
        this.blackList = model.blackList;
    }
}
