export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    realName: string;
    createdAt: Date;
    wasActiveAt: Date;
    isUnlocked?: boolean;
    updatedAt?: Date;
    turnedOffAt?: Date;
    bannedAt?: Date;
    bannedBy?: number;
}

export interface Messages {
    settings_id: number;
}
