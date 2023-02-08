import type Link from "../schemas/Link";

export default interface InitializeblePropertyState {
    isInitialized: boolean;
    link: Link | null;
}
