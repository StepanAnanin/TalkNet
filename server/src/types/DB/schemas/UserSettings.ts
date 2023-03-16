import type I_InitializeblePropertyState from "../../../types/DB/schemas/InitializeblePropertyState";

export default interface UserSettings {
    lastPasswordChange: number;
    emailChangeState: I_InitializeblePropertyState;
    accountDeletionState: I_InitializeblePropertyState;
}
