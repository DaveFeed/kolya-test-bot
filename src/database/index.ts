import path from 'path';
import { Logger as PinoLogger } from 'pino';
import { Logger } from 'src/libraries/logger';
import { QuickDB, SqliteDriver } from 'quick.db';

import { IDatabase as Config } from 'src/configs/interfaces';

import { Scenes } from 'telegraf';
import { SQLite } from '@telegraf/session/sqlite';

export class Database {
    private readonly db: QuickDB;

    private readonly log: PinoLogger;

    private readonly filePath: string;

    private readonly driver: SqliteDriver;

    private readonly config: Config;

    constructor(config: Config, logger: Logger) {
        this.config = config;
        this.log = logger.getLogger('Databases');
        this.filePath = path.join(this.config.path, this.config.fileName);

        this.driver = new SqliteDriver(this.filePath);

        this.db = new QuickDB({
            filePath: this.filePath,
            driver: new SqliteDriver(this.filePath)
        });
    }

    public async init(): Promise<void> {
        this.log.info({}, 'started init: databases');

        await this.db.init();
        // if (MIGRATE_AT_START) {
        // await this.migrate();
        // }
        this.log.info({}, 'ended init: databases');
    }

    public async backup(): Promise<boolean> {
        const result = await this.driver.database.backup(`backups/${new Date().getTime()}.sqlite`);

        return !result.remainingPages;
    }

    public getTable<T>(tableName: string): QuickDB<T> {
        return this.db.table<T>(tableName);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public getSessionsStorage() {
        return SQLite<Scenes.SceneSessionData>({
            filename: path.join(this.config.path, './sessions.sqlite')
        });
    }
}
