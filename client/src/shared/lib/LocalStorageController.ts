interface LocalStorageItem<T> {
    readonly set: (value: T) => void;
    readonly get: () => T | null;
    readonly reset: () => void;
}

class LocalStorageController {
    private readonly propertyAccessKeys = {
        /** TalkNet access token */
        accessToken: "_TNAT",
    } as const;

    public readonly accessToken: LocalStorageItem<string> = {
        set: (value) => localStorage.setItem(this.propertyAccessKeys.accessToken, value),
        get: () => localStorage.getItem(this.propertyAccessKeys.accessToken),
        reset: () => localStorage.removeItem(this.propertyAccessKeys.accessToken),
    } as const;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LocalStorageController();
