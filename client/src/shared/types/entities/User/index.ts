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
}
