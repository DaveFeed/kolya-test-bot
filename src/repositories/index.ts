import { Logger as PinoLogger } from 'pino';
import { Logger } from 'src/libraries/logger';

import { Database } from 'src/database';
import { IRepositories } from 'src/repositories/interfaces';
import { Messages, User } from 'src/domain/dto';

export class Repositories {
    private readonly log: PinoLogger;

    private repositories: IRepositories;

    constructor(logger: Logger, databases: Database) {
        this.log = logger.getLogger('repositories');
        this.log.info({}, 'setting up repositories: constructor');

        this.repositories = {
            users: databases.getTable<User>('users'),
            messages: databases.getTable<Messages>('messages')
        };

        this.log.info({}, 'repositories are ready: constructor');
    }

    public get getRepositories(): IRepositories {
        return this.repositories;
    }
}
