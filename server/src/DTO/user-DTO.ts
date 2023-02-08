type constructorModel = {
    id: string;
    userName: string;
    email: string;
    isActivated: boolean;
    lastPasswordChange: number;
    isEmailChangeInProcess: boolean;
    isAccountDeletionInProcess: boolean;
};

export default class UserDTO {
    public id: string;
    public userName: string;
    public email: string;
    public isActivated: boolean;
    public lastPasswordChange: number;
    public isEmailChangeInProcess: boolean;
    public isAccountDeletionInProcess: boolean;

    constructor(model: constructorModel) {
        this.id = model.id;
        this.userName = model.userName;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.lastPasswordChange = model.lastPasswordChange;
        this.isEmailChangeInProcess = model.isEmailChangeInProcess;
        this.isAccountDeletionInProcess = model.isAccountDeletionInProcess;
    }
}
