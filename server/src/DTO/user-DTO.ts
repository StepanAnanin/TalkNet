type constructorModel = {
    id: string;
    name: string;
    surname: string;
    patronymic: string | null;
    email: string;
    isActivated: boolean;
    lastPasswordChange: number;
    isEmailChangeInProcess: boolean;
    isAccountDeletionInProcess: boolean;
};

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

    constructor(model: constructorModel) {
        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.lastPasswordChange = model.lastPasswordChange;
        this.isEmailChangeInProcess = model.isEmailChangeInProcess;
        this.isAccountDeletionInProcess = model.isAccountDeletionInProcess;
    }
}
