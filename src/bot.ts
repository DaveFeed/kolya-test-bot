import { Telegraf, session, Scenes } from 'telegraf';
import { Logger as PinoLogger } from 'pino';

import { Logger } from 'src/libraries/logger';
import { Database } from 'src/database';
import { IConfig } from 'src/configs/interfaces';
import { Stage } from 'src/scenes';
import { Repositories } from 'src/repositories';
import { Context } from 'src/scenes/interfaces';
import { IRepositories } from './repositories/interfaces';

const { enter } = Scenes.Stage;

export class BotRunner {
    private readonly database: Database;

    private repositories?: IRepositories;

    private readonly logger: Logger;

    private readonly log: PinoLogger;

    private readonly config: IConfig;

    public readonly bot: Telegraf<Scenes.SceneContext>;

    constructor(config: IConfig) {
        this.logger = new Logger();
        this.log = this.logger.getLogger('bot-runner');

        this.log.info({}, 'started init: bot');

        this.config = config;

        this.bot = new Telegraf<Scenes.SceneContext>(this.config.constants.BOT_TOKEN);

        this.database = new Database(this.config.database, this.logger);

        this.log.info({}, 'ended init: bot');
    }

    public async start(): Promise<void> {
        this.log.info({}, 'starting: bot');

        await this.bot.launch();

        this.log.info({}, 'started: bot');
    }

    public async stop(): Promise<void> {
        this.log.info({}, 'stopping: bot');

        this.bot.stop();

        this.log.info({}, 'stopped: bot');
    }

    public async init(): Promise<void> {
        try {
            this.log.info({}, 'init started: bot');
            await this.database.init();

            this.repositories = new Repositories(this.logger, this.database).getRepositories;

            const stage = new Stage(this.logger, this.config.telegram, this.repositories).getStage;
            this.bot.use(this.lockerHandler.bind(this));
            this.bot.use(session());
            this.bot.use(stage.middleware());

            this.bot.start(enter<Context>('main'));

            this.log.info({}, 'init finished: bot');
        } catch (error) {
            this.log.error({ error }, 'Init was interrupted');
        }
    }

    private async lockerHandler(ctx: Context, next: () => Promise<void>): Promise<void> {
        try {
            const date = new Date().getTime();

            // todo:: check logs in here
            if (await this.repositories?.users.get(`${ctx.from?.id}.bannedAt`)) {
                this.log.info(
                    { id: ctx.from?.id, update: ctx.updateType, username: ctx.from?.username, date },
                    'Banned user request'
                );

                return;
            }

            this.log.info(
                { id: ctx.from?.id, update: ctx.updateType, username: ctx.from?.username, date },
                'Incoming request'
            );

            if (!(await this.repositories?.users.has(`${ctx.from?.id}.id`))) {
                await this.repositories?.users.set(`${ctx.from?.id}`, {
                    id: ctx.from?.id,
                    username: ctx.from?.username,
                    firstName: ctx.from?.first_name,
                    lastName: ctx.from?.last_name,
                    // realName: '', // todo:: (ADD) FROM EXCEL DB GET,
                    createdAt: date,
                    wasActiveAt: date,
                    updatedAt: date
                });
            }

            await Promise.allSettled([this.repositories?.users.set(`${ctx.from?.id}.wasActiveAt`, date)]);

            next();
        } catch (e) {
            this.log.error(e);
        }
    }
}
