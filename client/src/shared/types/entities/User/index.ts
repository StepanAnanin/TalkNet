export default interface User {
    id: string;
    userName: string;
    email: string;
    isActivated: boolean;
    lastPasswordChange: number;
    isEmailChangeInProcess: boolean;
    isAccountDeletionInProcess: boolean;
}
