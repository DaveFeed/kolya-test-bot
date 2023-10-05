export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    wasActiveAt: Date;
    isUnlocked?: boolean;
    updatedAt?: Date;
    turnedOffAt?: Date;
    bannedAt?: Date;
    bannedBy?: number;
}
