/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IConfig {
    database: IDatabase;
    constants: IConstants;
    telegram: ITelegram;
}

export interface IDatabase {
    path: string;
    backupPath: string;
    fileName: string;
}

export interface IConstants {
    NODE_ENV: string;
    BOT_TOKEN: string;
    DATABASE_PATH?: string;
    BACKUP_PATH?: string;
    DATABASE_FILE_NAME: string;
    MIGRATE_AT_START?: boolean;
    ADMIN_IDS: number[];
}

export interface ITelegram {
    admins: number[];
    sceneDefault: string;
    sceneTTL?: number;
}

export interface IRepository {}
