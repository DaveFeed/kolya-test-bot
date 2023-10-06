import { IConfig, IConstants, IDatabase, ITelegram } from 'src/configs/interfaces';

export class Config implements IConfig {
    constructor() {
        this.constants = {
            NODE_ENV: process.env.NODE_ENV || 'dev',
            BOT_API_TOKEN: process.env.BOT_API_TOKEN as string,
            DATABASE_PATH: process.env.DATABASE_PATH,
            BACKUP_PATH: process.env.BACKUP_PATH,
            DATABASE_FILE_NAME: process.env.DATABASE_FILE_NAME || 'instance.sqlite',
            ADMIN_IDS: JSON.parse(process.env.ADMIN_IDS || `[]`)
                .map((id: string) => Number(id))
                .filter((id: number) => !!id),
            MIGRATE_AT_START: false
        };

        this.database = {
            path: this.constants.DATABASE_PATH || 'db',
            backupPath: this.constants.BACKUP_PATH || 'db/backups',
            fileName: this.constants.DATABASE_FILE_NAME
        };

        this.telegram = {
            admins: this.constants.ADMIN_IDS,
            sceneDefault: 'main'
            // sceneTTL: 10
        };
    }

    public readonly constants: IConstants;

    public readonly database: IDatabase;

    public readonly telegram: ITelegram;
}
