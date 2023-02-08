type UserAccessLevelValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default interface UserAccessLevel {
    unlimited: 0;
    administrator: 1;
    moderator: 2;
    assistant: 3;
    defaultUser: 4;
    restrictedUser: 5;
    bannedUser: 6;
}

export type { UserAccessLevelValue };
